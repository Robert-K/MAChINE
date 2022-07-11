# inspired by André
import json
import pickle

import numpy as np
import tensorflow as tf

# n_units_per_layer = 256
# fingerprint_size = 128
# label = "homo"
from backend import storage_handler as sh

model = 0


def fit_model(self, model_id, dataset_id):
    modelconfig = sh.get_model(model_id)
    layers = []
    for i in range(0, modelconfig['num_layers'] - 2):
        layers[i] = tf.keras.layers.Dense(units=modelconfig['units_per_layer'], activation="relu")
    layers[modelconfig['num_layers'] - 1] = tf.keras.layers.Dense(units=1)
    self.model = tf.keras.models.sequential(layers)

    # managing the access to datasets got moved to separate class,

    with open(sh.get_dataset_path(dataset_id), "rb") as f:
        data = pickle.load(f)

    # data is stored as string, parse it first
    data = [json.loads(x) for x in data]

    x, y = zip(*[(mol["x"][str(modelconfig['fingerprint_size'])], mol["y"][modelconfig['label']]) for mol in data])
    x, y = np.array(x), np.array(y)

    model.compile(optimizer=tf.keras.optimizers.Adam(), loss=tf.keras.losses.MeanSquaredError(),
                  metrics=[tf.keras.metrics.MeanAbsoluteError()])

    model.build(input_shape=x.shape)
    model.summary()

    history = model.fit(x,
                        y,
                        epochs=modelconfig['epochs'],
                        batch_size=modelconfig['batch_size'],
                        verbose=modelconfig['verbose'],
                        use_multiprocessing=True)


def make_prediction(model_id, molecule):
    result = model.predict(molecule)
    sh.addNewMolecule(molecule, result)
