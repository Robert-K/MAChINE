from backend.utils.molecule_formats import smiles_to_fingerprint
import tensorflow as tf
from keras import layers


# parameters right now needs to contain fields for 'optimizer', 'units_per_layer', 'activationFunction', 'metrics'
_fingerprint_size = 512


def create_fnn_with_dataset(parameters, dataset, labels, loss, optimizer, metrics, batch_size):
    """
    creates a keras FNN and a tensorflow dataset from given parameters
    :param parameters: model parameters
    :param dataset: dataset to use
    :param labels: strings of labels to train on
    :param loss: keras loss function
    :param optimizer: keras optimizer
    :param metrics: array of keras metrics for training
    :param batch_size: integer, size of data batches
    :return: created model and dataset
    """
    layers_param = parameters.get('layers')

    # Get input/output for dataset
    x, y = zip(*[(mol.get("x").get("fingerprints").get(str(_fingerprint_size)),
                  list(mol.get("y").get(k) for k in labels)) for mol in dataset])
    x, y = tf.constant(x), tf.constant(y)

    # Builds the dataset for our model
    ds = tf.data.Dataset.from_tensor_slices((x, y)).batch(int(batch_size))

    # model creation
    model = tf.keras.models.Sequential()

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

    model.build(input_shape=x.get_shape())

    return model, ds


def smiles_to_fnn_input(smiles):
    # Converts our molecule to a fingerprint vector
    converted_molecule = smiles_to_fingerprint(smiles, fingerprint_size=_fingerprint_size)
    # Converts the fingerprint vector to tensorflow input
    if converted_molecule is not None:
        converted_molecule = tf.constant(converted_molecule, shape=(1, _fingerprint_size))
    return converted_molecule
