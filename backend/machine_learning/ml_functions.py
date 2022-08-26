from backend.utils import storage_handler as sh
import tensorflow as tf
import numpy as np
from backend.machine_learning import ml_dicts as mld


# Parameter content is currently WIP
# TODO: Work on
# parameters right now needs to contain fields for 'optimizer', 'units_per_layer', 'activationFunction', 'metrics'
def create(user_id, name, parameters, base_model_id):
    base_model = sh.get_base_model(base_model_id)
    layers = []

    for i in base_model["layers"]:
        if "activation" in i:
            layers.append(tf.keras.layers.Dense(units=i["units"], activation=i["activation"]), )

        else:
            layers.append(tf.keras.layers.Dense(units=i["units"]))

    model = tf.keras.models.Sequential(layers)

    model.compile(optimizer=mld.optimizer.get(parameters.get('optimizer')),
                  loss=mld.loss.get(base_model.get('lossFunction')),
                  metrics=[mld.metrics.get(parameters.get('metrics'))])

    # TODO: Implement: Replace input layer in train,
    #  see https://stackoverflow.com/questions/42187425/how-to-change-input-shape-in-sequential-model-in-keras
    model.build(input_shape=(10000, 128))
    return sh.add_model(user_id, name, parameters, base_model_id)


def train(user_id, dataset_id, model_id, fingerprint, label, epochs, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model = sh.get_model_summary(user_id, model_id)

    print(user_id, dataset_id, model_id, fingerprint, label, epochs, batch_size)

    # TODO: implement training (milestone for 26/08)

    x, y = zip(*[(mol["x"][str(fingerprint)], mol["y"][label]) for mol in dataset])
    x, y = np.array(x), np.array(y)
    fitting = model.fit(x, y, epochs=epochs, batch_size=batch_size)

    sh.add_fitting(user_id, dataset_id, epochs, batch_size, model_id, fitting)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)
