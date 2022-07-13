from pathlib import Path
import json
import shutil

class StorageHandler:
    # TODO: Rework methods to match dictionaries (Iva defines the dictionaries)

    def __init__(self, user_id):
        # self.models = []
        self.molecules = {'aaa': {5: {'god_why': 'help', 'number': 42, 'true': False}}}
        # self.fittings = []
        # self.base_models = []
        self.user_id = user_id
        self.user_path = Path.cwd() / 'user_data' / self.user_id
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

    def get_molecule(self, molecule_id):
        # TODO: this will crash
        return self.molecules[molecule_id]

    def clear_data(self, user_id):
        if self.user_id == user_id:
            self.__clean_files()

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
        loaded_models = []
        return loaded_models
        
    def __load_fittings(self):
        loaded_fittings = []
        return loaded_fittings

    def __load_model_file(self):
        pass

    def __save_model_file(self):
        pass
    """

    def __save_molecules_file(self):
        file_path = (self.user_path / 'molecules.json')
        file = file_path.open('w')
        json.dump(self.molecules, file)
        pass

    def __load_file(self, filename):
        array = []
        file_path = (self.user_path / filename)
        if file_path.exists():
            file = file_path.open('r')
            array = json.load(file)
        return array

    def __save_file(self, filename, content):
        file_path = (self.user_path / filename)
        file = file_path.open('w')
        json.dump(content, file)

    def __clean_files(self):
        shutil.rmtree(self.user_path)

    def __build_folder_structure(self):
        self.user_path.mkdir(parents=True, exist_ok=True)
        pass
