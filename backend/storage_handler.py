from pathlib import Path
import json
import shutil
import pickle

__all__ = ['add_fitting',
           'add_model',
           'add_molecule',
           'delete_user',
           'get_analyses',
           'get_base_model',
           'get_base_model_type',
           'get_base_model_types',
           'get_base_models',
           'get_dataset_info',
           'get_datasets_info',
           'get_fitting',
           'get_fittings',
           'get_model',
           'get_models',
           'get_molecules',
           'get_or_add_user']

_user_data_path = 'storage\\user_data'
_datasets_path = 'storage\\data'


class StorageHandler:

    def __init__(self):
        self.user_storage_handler = dict()
        self.datasets_info = dict()
        self.base_models = dict()
        self.base_model_types = dict()
        self.__analyze_datasets()

    def get_or_add_user(self, user_id):  # TODO: Test
        if self.user_storage_handler.get(user_id) is None:
            self.user_storage_handler[user_id] = UserDataStorageHandler(user_id)
        return self.user_storage_handler.get(user_id)

    def delete_user(self, user_id):
        self.user_storage_handler.pop(user_id)

    # Datasets
    def get_dataset_info(self, dataset_id):
        return self.datasets_info.get(dataset_id)

    def get_datasets_info(self):
        return self.datasets_info

    # Base Models
    def get_base_model(self, base_model_id):
        return self.base_models.get(base_model_id)

    def get_base_models(self):
        return self.base_models

    # Base Model Types
    def get_base_model_type(self, type_name):
        return self.base_model_types.get(type_name)

    def get_base_model_types(self):
        return self.base_model_types

    # User Storage
    # Molecules
    def add_molecule(self, user_id, smiles, analysis):
        self.get_or_add_user(user_id).add_new_molecule(smiles, analysis)

    def get_analyses(self, user_id, smiles):
        self.get_or_add_user(user_id).get_analyses(smiles)

    def get_molecules(self, user_id):
        self.get_or_add_user(user_id).get_molecules()

    # Models
    def add_model(self, user_id, model):
        self.get_or_add_user(user_id).add_model(model)

    def get_model(self, user_id, model_id):
        self.get_or_add_user(user_id).get_model(model_id)

    def get_models(self, user_id):
        self.get_or_add_user(user_id).get_models()

    # Fittings
    def add_fitting(self, user_id, fitting):
        self.get_or_add_user(user_id).add_fitting(fitting)

    def get_fitting(self, user_id, fitting_id):
        self.get_or_add_user(user_id).get_fitting(fitting_id)

    def get_fittings(self, user_id):
        self.get_or_add_user(user_id).get_fittings()

    # Private Methods
    def __analyze_datasets(self):
        for idx, dataset_path in enumerate(sorted((Path.cwd() / _datasets_path).glob('*.pkl'))):
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
                        'datasetPath': str(dataset_path.absolute())}
        return dataset_info


class UserDataStorageHandler:

    def __init__(self, user_id):
        self.user_path = Path.cwd() / _user_data_path / user_id
        self.__build_folder_structure()
        self.models = self.__load_file('models.json')
        self.molecules = self.__load_file('molecules.json')
        self.fittings = self.__load_file('fittings.json')

    def __del__(self):
        self.__clean_files()

    def add_new_molecule(self, smiles, analysis):
        self.molecules[smiles] = analysis
        self.__save_file('molecules.json', self.molecules)

    def get_molecules(self):
        return self.molecules

    def get_fittings(self):
        return self.fittings

    def get_analyses(self, smiles):
        return self.molecules[smiles]

    def get_models(self):
        return self.models

    def __get_model_name_from_fitting(self, fitting_id):
        return self.models[self.fittings[fitting_id]["model_id"]]["name"]

    def __load_file(self, filename):
        content = dict()
        file_path = (self.user_path / filename)
        if file_path.exists():
            file = file_path.open('r')
            content = json.load(file)
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


_inst = StorageHandler()
add_fitting = _inst.add_fitting
add_model = _inst.add_model
add_molecule = _inst.add_molecule
delete_user = _inst.delete_user
get_analyses = _inst.get_analyses
get_base_model = _inst.get_base_model
get_base_model_type = _inst.get_base_model_type
get_base_model_types = _inst.get_base_model_types
get_base_models = _inst.get_base_models
get_dataset_info = _inst.get_dataset_info
get_datasets_info = _inst.get_datasets_info
get_fitting = _inst.get_fitting
get_fittings = _inst.get_fittings
get_model = _inst.get_model
get_models = _inst.get_models
get_molecules = _inst.get_molecules
get_or_add_user = _inst.get_or_add_user
