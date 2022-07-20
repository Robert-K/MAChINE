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

    def __init__(self, user_id):
        self.models = {}
        self.molecules = {'aaa': {5: {'god_why': 'help', 'number': 42, 'true': False}}}  # TODO: delete test data
        self.fittings = {}
        self.base_models = {}
        self.datasets = {}
        self.user_id = user_id
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

    def add_new_molecule(self, smiles, analysis):
        self.molecules[smiles] = analysis
        self.__save_file('molecules.json', self.molecules)

    def get_molecules(self):
        return self.molecules

    def get_fitting(self, fitting_id):
        return self.fittings[fitting_id]

    def get_fittings(self):
        return self.fittings

    def get_model_name_from_fitting(self, fitting_id):
        return self.models[self.fittings[fitting_id]["model_id"]]["name"]

    # @param molecule: smiles code
    def get_analyses(self, molecule):
        return self.molecules[molecule]

    def get_models(self):
        return self.models

    def get_datasets(self):
        return self.datasets

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
