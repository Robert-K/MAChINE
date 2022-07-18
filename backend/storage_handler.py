import pathlib
from os.path import exists

models = []
molecules = []

path = pathlib.path(__file__).parent.absolute()


def get_dataset_path(id):
    path + ('{path}\\data{num}.pkl', 'rb').format(path=path, num=id)
    if exists(path):
        return path
    return


def add_new_model_config(self, epochs, batch_size, verbose, num_layers, units_per_layer, fingerprint_size, label):
    id = len(models)
    models.insert({self, epochs, batch_size, verbose, num_layers, units_per_layer, fingerprint_size, label})
    return id


def get_model_config(id):
    return models[id]


def add_molecule(molecule):
    id = len(molecules)
    molecules.insert(id, molecule)
    return id


def get_molecule(id):
    return molecules[id]


def get_models():
    return 0


def get_molecules():
    return 0
