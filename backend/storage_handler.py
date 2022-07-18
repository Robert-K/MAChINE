from pathlib import Path
import json
import shutil
import pickle

# New StorageHandler is created on login, if user folder is present, load that folder, else create new
# TODO: Delete folder on correct close of program/dereference of Handler. Problem: Scoreboard across different users

user_data_path = 'storage\\user_data'
datasets_path = 'storage\\data'


class StorageHandler:

    def __init__(self):
        self.__analyze_datasets()
        self.user_storage_handler = dict()
        self.datasets_info = dict()
        self.base_model_types = dict()

    def __get_user_handler(self, user_id):
        handler = self.user_storage_handler.get(user_id)
        # TODO: Test, may lead to more errors than simply returning 'None'
        return handler if handler is not None else UserDataStorageHandler('')

    def __analyze_datasets(self):
        for idx, dataset_path in enumerate(sorted((Path.cwd() / datasets_path).glob('*.pkl'))):
            if dataset_path.exists():
                self.datasets_info[idx] = self.__parse_dataset_info(dataset_path)

    def __parse_dataset_info(self, dataset_path):
        file = dataset_path.open('rb')
        content = pickle.load(file)
        file.close()
        dataset = [json.loads(x) for x in content]
        labels = dataset[0].get('y')
        dataset_info = {'name': str(labels.keys),
                        'size': len(dataset),
                        'labelDescriptors': list(labels.keys()),
                        'datasetPath': ''}
        return dataset_info


class UserDataStorageHandler:
    # TODO: Rework methods to match dictionaries (Iva defines the dictionaries)

    def __init__(self, user_id):
        # self.models = dict()
        self.molecules = dict()  # TODO: remove {'aaa': {5: {'god_why': 'help', 'number': 42, 'true': False}}}
        # self.fittings = dict()
        self.user_path = Path.cwd() / user_data_path / user_id
        load_saved = self.user_path.exists()
        self.__build_folder_structure()
        if load_saved:  # reload last saved data
            # self.models = self.__load_models()
            self.molecules = self.__load_file('molecules.json')
            # self.fittings = self.__load_fittings()
        else:  # create all new files

            # self.__save_model_file()
            self.__save_file('molecules.json', self.molecules)
            # self.__save_fittings_file()

        # self.datasets = self.__parse_datasets(Path.cwd() / 'data')

    def __del__(self):
        # self.__clean_files()
        pass

    """
    def add_new_model_config(self, epochs, batch_size, verbose, num_layers, units_per_layer, fingerprint_size, label):
        # TODO:
        config_id = len(self.models)
        self.models.insert()
        return config_id

    def get_model_config(self, model_id):
        # TODO: this will crash, eventually
        return self.models[model_id]
    """

    def add_new_molecule(self, smiles, analysis):
        self.molecules[smiles] = analysis
        self.__save_file('molecules.json', self.molecules)

    # May return None
    def get_molecule(self, smiles):
        return self.molecules.get(smiles)


    """
    def get_models(self):
        return self.models

    def get_molecules(self):
        return self.molecules

    def get_fittings(self):
        return self.fittings

    def __get_dataset_path(self, dataset_id):
        dataset_path = Path(f'{self.user_path}\\data{dataset_id}.pkl')
        if dataset_path.exists:
            return dataset_path
        return

    def __load_dataset(self, dataset_id):
        file = self.__get_dataset_path(dataset_id)
        return

    def __load_models(self):
        loaded_models = dict()
        return loaded_models
        
    def __load_fittings(self):
        loaded_fittings = dict()
        return loaded_fittings

    def __load_model_file(self):
        pass

    def __save_model_file(self):
        pass
    """

    def __load_file(self, filename):
        content = dict()
        file_path = (self.user_path / filename)
        if file_path.exists():
            file = file_path.open('r')
            array = json.load(file)
            file.close()
        return content

    def __save_file(self, filename, content):
        file_path = (self.user_path / filename)
        file = file_path.open('w')
        json.dump(content, file)
        file.close()

    def __clean_files(self):
        shutil.rmtree(self.user_path)

    def __build_folder_structure(self):
        self.user_path.mkdir(parents=True, exist_ok=True)
