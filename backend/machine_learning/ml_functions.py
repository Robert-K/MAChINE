from backend.utils import storage_handler as sh
import tensorflow as tf
import numpy as np
from backend.machine_learning import ml_dicts as mld

fingerprint = ["128", "512", "1024"]


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


def train(user_id, dataset_id, model_id, label, epochs, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model_summary = sh.get_model_summary(user_id, model_id)
    base_model = sh.get_base_model(model_summary.get('baseModelID'))
    model, ds = mld.creation_functions(base_model.get('type'))

    print(user_id, dataset_id, model_id, label, epochs, batch_size)

    # TODO: implement training (milestone for 26/08)

    x, y = zip(*[(mol["x"].get("fingerprints")[fingerprint[0]], mol["y"][label]) for mol in dataset])
    x, y = np.array(x), np.array(y)

    #################################################
    n_units_per_layer = 256

    model = tf.keras.models.Sequential([
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
        tf.keras.layers.Dense(units=1)
    ])

    model.compile(optimizer=tf.keras.optimizers.Adam(), loss=tf.keras.losses.MeanSquaredError(),
                  metrics=[tf.keras.metrics.MeanAbsoluteError()])

    model.build(input_shape=x.shape)
    model.summary()

    #################################################

    fitting = model.fit(x, y, epochs=int(epochs), batch_size=int(batch_size))

    sh.add_fitting(user_id, dataset_id, epochs, 0, batch_size, model_id, model)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)
