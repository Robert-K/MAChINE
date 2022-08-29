from backend.utils import storage_handler as sh
import tensorflow as tf
from backend.machine_learning import ml_dicts as mld
from tensorflow import keras
from keras import layers

# Parameter content is currently WIP
# TODO: Work on
# parameters right now needs to contain fields for 'optimizer', 'units_per_layer', 'activationFunction', 'metrics'
def create_fnn(parameters, loss, optimizer, metrics, fingerprint, labels):
    layers = parameters.get('layers')

    model = tf.keras.models.Sequential()
    # todo see if using relu causes problems.
    # Adding the first layer
    model.add(tf.keras.layers.Dense(units=int(fingerprint), activation='relu'))
    # Adding the hidden layers
    for layer in layers:
        model.add(tf.keras.layers.Dense(units=layer.get('units'), activation=layer.get('activation')))
    # Adding the final layer
    model.add(layers.Dense(units=labels.len()))

    model.compile(optimizer=optimizer,
                  loss=loss,
                  metrics=metrics)

    model.build(input_shape=(10000, 128))

    return model

def train(user_id, dataset_id, model_id, fingerprint, labels, epochs, accuracy, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model_summary = sh.get_model_summary(model_id)
    model = create_fnn(model_summary.get('parameters'), mld.loss.get(model_summary.get('parameters').get('loss')), mld.optimizer.get(model_summary.get('parameters').get('optimizer')), [mld.metrics.get(model_summary.get('base_model').get('metric'))], fingerprint, labels)

    # TODO: implement training (milestone for 26/08)
    #todo fit
    model.fit()

    sh.add_fitting(user_id, dataset_id, epochs, accuracy, batch_size, model_id, model)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)
