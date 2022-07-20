import re
from pathlib import Path
import json
import shutil
import pickle

__all__ = ['add_analysis',
           'add_fitting',
           'add_model',
           'add_molecule',
           'add_user_handler',
           'delete_user_handler',
           'get_analyses',
           'get_base_model',
           'get_base_models',
           'get_dataset',
           'get_dataset_summaries',
           'get_fitting',
           'get_fitting_summaries',
           'get_model',
           'get_model_summaries',
           'get_molecules',
           'get_user_handler']

_storage_path = Path('storage')
_user_data_path = _storage_path / 'user_data'
_datasets_path = _storage_path / 'data'
_base_models_path = _storage_path / 'models'


class UserDataStorageHandler:

    def __init__(self, user_id):
        self.user_path = Path.cwd() / _user_data_path / user_id
        self.user_models_path = self.user_path / 'models'
        self.user_fittings_path = self.user_path / 'fittings'
        self.__build_folder_structure()
        self.molecules = self.__load_summary_file('molecules.json')
        self.model_summaries = self.__load_summary_file('models.json')
        self.fitting_summaries = self.__load_summary_file('fittings.json')

    def __del__(self):
        self.__clean_files()

    # Molecules
    def add_molecule(self, smiles, name):
        self.molecules[smiles] = {'name': name, 'analyses': dict()}
        self.__save_summary_file('molecules.json', self.molecules)

    def get_molecules(self):
        return self.molecules

    # Analyses
    def add_analysis(self, smiles, fitting_id, results):
        molecule = self.molecules.get(smiles)
        if molecule and molecule.get('analyses'):
            molecule.get('analyses')[fitting_id] = results
            self.__save_summary_file('molecules.json', self.molecules)

    def get_analyses(self, smiles):
        return self.molecules.get(smiles)

    # Models
    def add_model(self, name, base_model_id, model):
        model_id = hash(model)
        path = self.user_models_path / f'{model_id}_model.pkl'
        file = path.open('wb')
        pickle.dump(model, file)
        file.close()
        self.model_summaries[model_id] = {'name': name,
                                          'baseModelID': base_model_id,
                                          'modelPath': path,
                                          'fittingIDs': []
                                          }
        self.__save_summary_file('models.json', self.model_summaries)
        return model_id

    # Models are pickled
    def get_model(self, model_id):
        summary = self.model_summaries.get(model_id)
        if summary and summary.get('modelPath'):
            path = Path(summary.get('modelPath'))
            if path.exists():
                file = path.open('rb')
                content = pickle.load(file)
                file.close()
                # TODO: Work on this in milestone 'model_training'
                return content

    def get_model_summaries(self):
        return self.model_summaries

    # Fittings
    def add_fitting(self, dataset_id, epochs, accuracy, model_id, fitting):
        fitting_id = hash(fitting)
        path = self.user_fittings_path / f'{fitting_id}_fitting.pkl'
        file = path.open('wb')
        pickle.dump(fitting, file)
        file.close()
        self.fitting_summaries[fitting_id] = {'datasetID': dataset_id,
                                              'epochs': epochs,
                                              'accuracy': accuracy,
                                              'fittingPath': path,
                                              'modelID': model_id
                                              }
        self.__save_summary_file('fittings.json', self.fitting_summaries)
        return fitting_id

    def get_fitting(self, fitting_id):
        summary = self.fitting_summaries.get(fitting_id)
        if summary and summary.get('fittingPath'):
            path = Path(summary.get('fittingPath'))
            if path.exists():
                file = path.open('rb')
                content = pickle.load(file)
                file.close()
                # TODO: Work on this in milestone 'model_training'
                return content

    def get_fitting_summaries(self):
        return self.fitting_summaries

    # Private Methods
    def __load_summary_file(self, filename):
        content = dict()
        file_path = (self.user_path / filename)
        if file_path.exists():
            file = file_path.open('r')
            content = json.load(file)
            file.close()
        return content

    def __save_summary_file(self, filename, content):
        file_path = (self.user_path / filename)
        file = file_path.open('w')
        json.dump(content, file)
        file.close()

    def __clean_files(self):
        shutil.rmtree(self.user_path)

    def __build_folder_structure(self):
        self.user_path.mkdir(parents=True, exist_ok=True)
        self.user_models_path.mkdir(parents=True, exist_ok=True)
        self.user_fittings_path.mkdir(parents=True, exist_ok=True)


# Goal: Never use file.open outside of storage handler
# TODO: Test this boi
class StorageHandler:

    def __init__(self):
        self.user_storage_handler = dict()
        self.dataset_summaries = dict()
        self.base_models = dict()
        self.base_model_types = dict()
        self.__analyze_datasets()
        self.__analyze_base_models()

    def add_user_handler(self, user_id) -> UserDataStorageHandler:
        if self.user_storage_handler.get(user_id) is None:
            self.user_storage_handler[user_id] = UserDataStorageHandler(user_id)
        return self.user_storage_handler.get(user_id)

    def get_user_handler(self, user_id) -> UserDataStorageHandler:
        return self.user_storage_handler.get(user_id)

    def delete_user_handler(self, user_id):
        self.user_storage_handler.pop(user_id)

    # Datasets
    def get_dataset(self, dataset_id):
        summary = self.dataset_summaries.get(dataset_id)
        if summary and summary.get('datasetPath'):
            path = Path(summary.get('datasetPath'))
            if path.exists():
                file = path.open('rb')
                content = pickle.load(file)
                file.close()
                dataset = [json.loads(x) for x in content]
                return dataset

    def get_dataset_summaries(self):
        return self.dataset_summaries

    # Base Models
    def get_base_model(self, base_model_id):
        return self.base_models.get(base_model_id)

    def get_base_models(self):
        return self.base_models

    # User Storage
    # Molecules
    def add_molecule(self, user_id, smiles, name):
        self.get_user_handler(user_id).add_molecule(smiles, name)

    def get_molecules(self, user_id):
        return self.get_user_handler(user_id).get_molecules()

    # Molecule Analyses
    def add_analysis(self, user_id, smiles, fitting_id, results):
        self.get_user_handler(user_id).add_analysis(smiles, fitting_id, results)

    def get_analyses(self, user_id, smiles):
        return self.get_user_handler(user_id).get_analyses(smiles)

    # Models
    # model is the actual model, not a summary
    def add_model(self, user_id, name, base_model_id, model):
        return self.get_user_handler(user_id).add_model(name, base_model_id, model)

    def get_model(self, user_id, model_id):
        return self.get_user_handler(user_id).get_model(model_id)

    def get_model_summaries(self, user_id):
        return self.get_user_handler(user_id).get_model_summaries()

    # Fittings
    # fitting is the actual, trained model, not a summary
    def add_fitting(self, user_id, dataset_id, epochs, accuracy, model_id, fitting):
        return self.get_user_handler(user_id).add_fitting(dataset_id, epochs, accuracy, model_id,
                                                          fitting)

    def get_fitting(self, user_id, fitting_id):
        return self.get_user_handler(user_id).get_fitting(fitting_id)

    def get_fitting_summaries(self, user_id):
        return self.get_user_handler(user_id).get_fitting_summaries()

    # Private Methods
    # Datasets
    def __analyze_datasets(self):
        for idx, dataset_path in enumerate(sorted((Path.cwd() / _datasets_path).glob('*.pkl'))):
            if dataset_path.exists():
                self.dataset_summaries[idx] = self.__summarize_dataset(dataset_path)

    @staticmethod
    def __summarize_dataset(dataset_path):
        file = dataset_path.open('rb')
        content = pickle.load(file)
        file.close()
        dataset = [json.loads(x) for x in content]
        labels = dataset[0].get('y')
        dataset_summary = {'name': re.sub(r"(?<=\w)([A-Z])", r" \1", dataset_path.stem),
                           'size': len(dataset),
                           'labelDescriptors': list(labels.keys()),
                           'datasetPath': str(dataset_path.absolute())}
        return dataset_summary

    # Base Models & Base Model Types
    def __analyze_base_models(self):  # TODO: Implement
        pass

    def __read_base_model_types(self):  # TODO: Discuss base model types etc.
        type_path = Path.cwd() / _base_models_path / 'types.json'
        if type_path.exists():
            file = type_path.open('r')
            self.base_model_types = json.load(file)
            file.close()


_inst = StorageHandler()
add_analysis = _inst.add_analysis
add_fitting = _inst.add_fitting
add_model = _inst.add_model
add_molecule = _inst.add_molecule
add_user_handler = _inst.add_user_handler
delete_user_handler = _inst.delete_user_handler
get_analyses = _inst.get_analyses
get_base_model = _inst.get_base_model
get_base_models = _inst.get_base_models
get_dataset = _inst.get_dataset
get_dataset_summaries = _inst.get_dataset_summaries
get_fitting = _inst.get_fitting
get_fitting_summaries = _inst.get_fitting_summaries
get_model = _inst.get_model
get_model_summaries = _inst.get_model_summaries
get_molecules = _inst.get_molecules
get_user_handler = _inst.get_user_handler
