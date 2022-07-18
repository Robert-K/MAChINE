import pathlib
from os.path import exists


models = []
molecules = []

path = pathlib.Path(__file__).parent.absolute()


def get_dataset_path(id):
    path + ('{path}\\data{num}.pkl', 'rb').format(path=path, num=id)
    if exists(path):
        return path
    return


def add_new_model_config(epochs, batch_size, num_layers, units_per_layer, label):
    modelconfig_id = len(models)
    models.insert(modelconfig_id, {epochs, batch_size, num_layers, units_per_layer, label})
    print('epochs: {e}, batch_size: {b}, numlayers: {num}, units per layer: {u}, label: {l}'.format(e=epochs, b=batch_size, num=num_layers, u=units_per_layer, l=label))
    return modelconfig_id


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
