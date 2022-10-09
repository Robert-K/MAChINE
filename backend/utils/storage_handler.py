from pathlib import Path
import json
import shutil
import atexit
import pickle
import tensorflow as tf
import shortuuid

# registry of storage_handler functions
__all__ = ['add_analysis',
           'add_fitting',
           'add_model',
           'add_molecule',
           'add_user_handler',
           'delete_scoreboard_fitting',
           'delete_scoreboard_fittings',
           'delete_user_handler',
           'get_base_model',
           'get_base_models',
           'get_dataset',
           'get_dataset_summaries',
           'get_fitting',
           'get_fitting_summary',
           'get_fitting_summaries',
           'get_scoreboard_summaries',
           'get_model_summary',
           'get_model_summaries',
           'get_molecules',
           'get_user_handler',
           'update_fitting']

_storage_path = Path.cwd() / 'storage'
_user_data_path = _storage_path / 'user_data'
_datasets_path = _storage_path / 'data'
_base_models_path = _storage_path / 'models'
# keep dataset_version in sync with create_dataset version
_dataset_version = 5


class UserDataStorageHandler:
    """
    Class which holds data for a specific user and methods to store and retrieve it
    """

    def __init__(self, user_id, username):
        """
        Creates a new UserDataStorageHandler.

        Creates the folders necessary for proper data storage.

        Retrieves possible stored data from summary files within the user_path.

        Deletes all Data on Handler deletion.

        :param user_id: ID of the user
        :param username: Name of the user
        """
        self.user_path = _user_data_path / user_id
        self.user_fittings_path = self.user_path / 'fittings'
        self.__build_folder_structure()
        self.molecules = self.__load_summary_file('molecules.json')
        self.model_summaries = self.__load_summary_file('models.json')
        self.fitting_summaries = self.__load_summary_file('fittings.json')
        self.username = username
        atexit.register(self.clean_files)

    # Molecules
    def add_molecule(self, smiles, cml, name):
        self.molecules[smiles] = {'name': name, 'cml': cml, 'analyses': dict()}
        self.__save_summary_file('molecules.json', self.molecules)

    def get_molecules(self):
        return self.molecules

    # Analyses
    def add_analysis(self, smiles, fitting_id, results):
        molecule = self.molecules.get(smiles)
        if molecule:
            molecule.get('analyses')[fitting_id] = results
            self.__save_summary_file('molecules.json', self.molecules)

    # Models
    def add_model(self, name, parameters, base_model_id):
        model_id = shortuuid.uuid()
        self.model_summaries[model_id] = {'name': name,
                                          'baseModelID': base_model_id,
                                          'parameters': parameters,
                                          'fittingIDs': []
                                          }
        self.__save_summary_file('models.json', self.model_summaries)
        return model_id

    def get_model_summary(self, model_id):
        return self.model_summaries.get(model_id)

    def get_model_summaries(self):
        return self.model_summaries

    # Fittings
    # Saves a fitting, creates a summary, updates the model summary
    def add_fitting(self, dataset_id, labels, epochs, accuracy, batch_size, model_id, fitting):
        fitting_id = shortuuid.uuid()
        path = self.save_fitting(fitting_id, fitting)
        if path is None:
            return None
        self.fitting_summaries[fitting_id] = {'datasetID': dataset_id,
                                              'labels': labels,
                                              'epochs': epochs,
                                              'accuracy': accuracy,
                                              'batchSize': batch_size,
                                              'fittingPath': str(path),
                                              'modelID': model_id
                                              }
        self.__save_summary_file('fittings.json', self.fitting_summaries)
        self.add_fitting_to_model(model_id, fitting_id)
        return fitting_id

    def add_fitting_to_model(self, model_id, fitting_id):
        summary = self.get_model_summaries().get(model_id)
        summary.get('fittingIDs').append(fitting_id)
        self.__save_summary_file('models.json', self.model_summaries)

    def update_fitting(self, fitting_id, epochs, accuracy, fitting):
        path = self.save_fitting(fitting_id, fitting)
        summary = self.fitting_summaries.get(fitting_id)
        # Deletes the existing summary if it can't update the fitting
        if path is None or summary is None:
            self.fitting_summaries[fitting_id] = None
            del summary
            return None
        summary['epochs'] = epochs
        summary['accuracy'] = accuracy
        self.__save_summary_file('fittings.json', self.fitting_summaries)
        return fitting_id

    def save_fitting(self, fitting_id, fitting):
        path = self.user_fittings_path / f'{fitting_id}_fitting'
        try:
            fitting.save(path)
            return path
        except NotImplementedError:
            print('Cannot save this model. Please write serialisation functions')
            return None

    def get_fitting(self, fitting_id):
        summary = self.fitting_summaries.get(fitting_id)
        if summary and summary.get('fittingPath'):
            path = Path(summary.get('fittingPath'))
            if path.exists():
                return tf.keras.models.load_model(path)

    def get_fitting_summary(self, fitting_id):
        return self.fitting_summaries.get(fitting_id)

    def get_fitting_summaries(self):
        return self.fitting_summaries

    def clean_files(self):
        if shutil:
            try:
                if self.user_path.exists():
                    shutil.rmtree(self.user_path)
            except (OSError, TypeError) as e:
                print(f'Error deleting {self.user_path.stem}')
                print(e)

    # Private Methods
    def __load_summary_file(self, filename):
        content = dict()
        file_path = (self.user_path / filename)
        if file_path.exists():
            file = file_path.open('r')
            try:
                content = json.load(file)
            except json.decoder.JSONDecodeError:
                print('Error reading', file.name)
                content = {}
            file.close()
        return content

    def __save_summary_file(self, filename, content):
        file_path = (self.user_path / filename)
        file = file_path.open('w')
        json.dump(content, file)
        file.close()

    def __build_folder_structure(self):
        self.user_path.mkdir(parents=True, exist_ok=True)
        self.user_fittings_path.mkdir(parents=True, exist_ok=True)


class StorageHandler:
    """
    Handler for all storage access requests
    Holds user data storage handlers and delegates to them based on given user id from outside request
    Holds sole access to datasets, base models and the scoreboard

    Bundles all file accesses
    Singleton based on class Random in random.py
    """

    def __init__(self):
        self.user_storage_handler = dict()
        self.dataset_summaries = dict()
        self.base_models = dict()
        self.base_model_types = dict()
        self.__analyze_datasets()
        self.__read_base_model_types()
        self.__read_base_models()
        self.scoreboard_summaries = self.__read_scoreboard_summaries()

    def add_user_handler(self, user_id, username) -> UserDataStorageHandler:
        self.user_storage_handler[user_id] = UserDataStorageHandler(user_id, username)
        return self.user_storage_handler.get(user_id)

    def get_user_handler(self, user_id) -> UserDataStorageHandler | None:
        return self.user_storage_handler.get(user_id)

    def delete_user_handler(self, user_id):
        handler = self.user_storage_handler.pop(user_id, None)
        if handler:
            handler.clean_files()

    # Datasets
    def get_dataset(self, dataset_id):
        summary = self.dataset_summaries.get(str(dataset_id))
        if summary and summary.get('datasetPath'):
            path = Path(summary.get('datasetPath'))
            if path.exists():
                file = path.open('rb')
                content = pickle.load(file)
                file.close()
                return content.get('dataset')

    def get_dataset_summaries(self):
        return self.dataset_summaries

    def get_dataset_histograms(self, dataset_id, labels):
        dataset_summary = self.dataset_summaries.get(dataset_id)
        histograms = dict()
        if dataset_summary and 'histograms' in dataset_summary:
            for label, histogram in dataset_summary.get('histograms').items():
                if label in labels:
                    histograms[label] = dict(histogram)
            return histograms

    # Base Models
    def get_base_model(self, base_model_id):
        return self.base_models.get(base_model_id)

    def get_base_models(self):
        return self.base_models

    # User Storage
    # Molecules
    def add_molecule(self, user_id, smiles, cml, name):
        self.get_user_handler(user_id).add_molecule(smiles, cml, name)

    def get_molecules(self, user_id):
        return self.get_user_handler(user_id).get_molecules()

    # Molecule Analyses
    def add_analysis(self, user_id, smiles, fitting_id, results):
        self.get_user_handler(user_id).add_analysis(smiles, fitting_id, results)

    # Models
    # model is the actual model, not a summary
    def add_model(self, user_id, name, parameters, base_model_id):
        return self.get_user_handler(user_id).add_model(name, parameters, base_model_id)

    def get_model_summary(self, user_id, model_id):
        return self.get_user_handler(user_id).get_model_summary(model_id)

    def get_model_summaries(self, user_id):
        return self.get_user_handler(user_id).get_model_summaries()

    # Fittings
    # fitting is the actual, trained model, not a summary
    def add_fitting(self, user_id, dataset_id, labels, epochs, accuracy, batch_size, model_id, fitting):
        fitting_id = self.get_user_handler(user_id).add_fitting(dataset_id, labels, epochs, accuracy, batch_size,
                                                                model_id,
                                                                fitting)
        # Creates the scoreboard fitting summary
        self.scoreboard_summaries[fitting_id] = {'id': fitting_id,
                                                 'userName': str(self.get_user_handler(user_id).username),
                                                 'modelID': model_id,
                                                 'modelName': self.get_user_handler(user_id).get_model_summary(
                                                     model_id).get(
                                                     'name'),
                                                 'datasetID': dataset_id,
                                                 'datasetName': self.get_dataset_summaries().get(dataset_id).get('name'),
                                                 'labels': labels,
                                                 'epochs': epochs,
                                                 'batchSize': batch_size,
                                                 'accuracy': accuracy}
        self.__save_scoreboard_summaries()
        return fitting_id

    def update_fitting(self, user_id, fitting_id, epochs, accuracy, fitting):
        fitting_id = self.get_user_handler(user_id).update_fitting(fitting_id, epochs, accuracy, fitting)
        # Updates the scoreboard fitting summary
        scoreboard_fitting = self.scoreboard_summaries.get(fitting_id)
        if scoreboard_fitting:
            scoreboard_fitting['epochs'] = epochs
            scoreboard_fitting['accuracy'] = accuracy
            self.__save_scoreboard_summaries()
        return fitting_id

    def get_fitting(self, user_id, fitting_id):
        return self.get_user_handler(user_id).get_fitting(fitting_id)

    def get_fitting_summary(self, user_id, fitting_id):
        return self.get_user_handler(user_id).get_fitting_summary(fitting_id)

    def get_scoreboard_summaries(self):
        return self.scoreboard_summaries

    def delete_scoreboard_fitting(self, fitting_id):
        self.scoreboard_summaries.pop(fitting_id, None)
        self.__save_scoreboard_summaries()

    def delete_scoreboard_fittings(self):
        self.scoreboard_summaries = dict()
        self.__save_scoreboard_summaries()

    def get_fitting_summaries(self, user_id):
        return self.get_user_handler(user_id).get_fitting_summaries()

    # Datasets
    def __analyze_datasets(self):
        for idx, dataset_path in enumerate(sorted(_datasets_path.glob('*.pkl'))):
            if dataset_path.exists():
                self.dataset_summaries[str(idx)] = self.__summarize_dataset(dataset_path)

    @staticmethod
    def __summarize_dataset(dataset_path):
        file = dataset_path.open('rb')
        content = pickle.load(file)
        file.close()
        if content.get('version') != _dataset_version:
            print(
                f'Dataset {content.get("name")} not compatible. Current version: {_dataset_version}. Set version: {content.get("version")}')
            return
        dataset_summary = {'name': content.get('name'),
                           'size': content.get('size'),
                           'labelDescriptors': content.get('labels'),
                           'datasetPath': str(dataset_path.absolute()),
                           'histograms': content.get('histograms')
                           }
        return dataset_summary

    # Base Models & Base Model Types
    def __read_base_models(self):
        path = _base_models_path / 'baseModels.json'
        if path.exists():
            file = path.open('r')
            self.base_models = json.load(file)
            file.close()

    def __read_base_model_types(self):
        type_path = _base_models_path / 'modelTypes.json'
        if type_path.exists():
            file = type_path.open('r')
            self.base_model_types = json.load(file)
            file.close()

    @staticmethod
    def __read_scoreboard_summaries():
        scoreboard_path = _user_data_path / 'scoreboard.json'
        data = dict()
        if scoreboard_path.exists():
            file = scoreboard_path.open('r')
            data = json.load(file)
            file.close()
        return data

    def __save_scoreboard_summaries(self):
        scoreboard_path = _user_data_path / 'scoreboard.json'
        file = scoreboard_path.open('w')
        json.dump(self.scoreboard_summaries, file)
        file.close()


_inst = StorageHandler()
add_analysis = _inst.add_analysis
add_fitting = _inst.add_fitting
add_model = _inst.add_model
add_molecule = _inst.add_molecule
add_user_handler = _inst.add_user_handler
delete_scoreboard_fitting = _inst.delete_scoreboard_fitting
delete_scoreboard_fittings = _inst.delete_scoreboard_fittings
delete_user_handler = _inst.delete_user_handler
get_base_model = _inst.get_base_model
get_base_models = _inst.get_base_models
get_dataset = _inst.get_dataset
get_dataset_summaries = _inst.get_dataset_summaries
get_dataset_histograms = _inst.get_dataset_histograms
get_fitting = _inst.get_fitting
get_fitting_summary = _inst.get_fitting_summary
get_fitting_summaries = _inst.get_fitting_summaries
get_scoreboard_summaries = _inst.get_scoreboard_summaries
get_model_summary = _inst.get_model_summary
get_model_summaries = _inst.get_model_summaries
get_molecules = _inst.get_molecules
get_user_handler = _inst.get_user_handler
update_fitting = _inst.update_fitting
