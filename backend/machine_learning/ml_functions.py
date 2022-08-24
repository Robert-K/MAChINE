from backend.utils import storage_handler as sh
import tensorflow as tf
from backend.machine_learning import ml_dicts as mld

# Parameter content is currently WIP
# TODO: Work on
# parameters right now needs to contain fields for 'optimizer', 'units_per_layer', 'activationFunction', 'metrics'
def create(user_id, name, parameters, base_model_id):
    base_model = sh.get_base_model(base_model_id)
    n_units_per_layer = parameters.get('units_per_layer')

    # TODO: Implement Model creation properly
    model = tf.keras.models.Sequential([
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=1)
    ])

    model.compile(optimizer=mld.optimizer.get(parameters.get('optimizer')),
                  loss=mld.loss.get(base_model.get('lossFunction')),
                  metrics=[mld.metrics.get(parameters.get('metrics'))])

    # TODO: Implement: Replace input layer in train,
    #  see https://stackoverflow.com/questions/42187425/how-to-change-input-shape-in-sequential-model-in-keras
    model.build(input_shape=(10000, 128))
    return sh.add_model(user_id, name, parameters, base_model_id, model)


def train(user_id, dataset_id, model_id, fingerprint, label, epochs, accuracy, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model = sh.get_model(user_id, model_id)

    # TODO: implement training (milestone for 26/08)
    fitting = None

    sh.add_fitting(user_id, dataset_id, epochs, accuracy, batch_size, model_id, fitting)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)
