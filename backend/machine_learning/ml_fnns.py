from rdkit import Chem
from rdkit.Chem import AllChem

from backend.utils import storage_handler as sh
import tensorflow as tf
from backend.machine_learning import ml_dicts as mld
from tensorflow import keras
from keras import layers

# Parameter content is currently WIP
# TODO: Work on
# parameters right now needs to contain fields for 'optimizer', 'units_per_layer', 'activationFunction', 'metrics'
# Technically, we do not need batchSize in this method. It was added so that create_fnn and create_schnet have the same signature
_fingerprint_size = 512


def create_fnn_with_dataset(parameters, dataset, labels, loss, optimizer, metrics, batch_size):
    layers_param = parameters.get('layers')

    # Create thingies for dataset
    x, y = zip(*[(mol["x"].get("fingerprints")[str(_fingerprint_size)], mol["y"][labels]) for mol in dataset])
    x, y = tf.constant(x), tf.constant(y)

    model = tf.keras.models.Sequential()
    # todo see if using relu causes problems.
    # Adding the first layer
    model.add(tf.keras.layers.Dense(units=int(_fingerprint_size), activation='relu'))
    # Adding the hidden layers
    for layer in layers_param:
        model.add(tf.keras.layers.Dense(units=layer.get('units'), activation=layer.get('activation')))
    # Adding the final layer
    model.add(layers.Dense(units=len(labels)))

    model.compile(optimizer=optimizer,
                  loss=loss,
                  metrics=metrics)

    model.build(input_shape=x.shape)

    ds = tf.data.Dataset.from_tensor_slices((x, y)).batch(int(batch_size))

    return model, ds


def train(user_id, dataset_id, model_id, fingerprint, labels, epochs, accuracy, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model_summary = sh.get_model_summary(model_id)
    model = create_fnn_with_dataset(model_summary.get('parameters'), dataset, labels,
                                    mld.loss.get(model_summary.get('parameters').get('loss')),
                                    mld.optimizer.get(model_summary.get('parameters').get('optimizer')),
                                    [mld.metrics.get(model_summary.get('base_model').get('metric'))], batch_size)

    # TODO: implement training (milestone for 26/08)
    # todo fit
    model.fit()

    sh.add_fitting(user_id, dataset_id, epochs, accuracy, batch_size, model_id, model)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)


def smiles_to_fingerprint(smiles):
    try:
        mol = Chem.MolFromSmiles(smiles)
        fingerprint = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=_fingerprint_size)
        return list(fingerprint)
    except (IndexError, ValueError):
        return None
