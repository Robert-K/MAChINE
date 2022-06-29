# inspired by André

import numpy as np
import tensorflow as tf
from numpy.ma import mvoid

import datasets as ds

# n_units_per_layer = 256
# fingerprint_size = 128
# label = "homo"
from backend import resulthandler

model = 0


def fit_model(self, num_layers, dataset_id, units_per_layer, fingerprint_size, label):
    layers = []
    for i in range(0, num_layers - 2):
        layers[i] = tf.keras.layers.Dense(units=units_per_layer, activation="relu")
    layers[num_layers - 1] = tf.keras.layers.Dense(units=1)
    self.model = tf.keras.models.sequential(layers)

    # managing the access to datasets got moved to separate class,
    data = ds.getDataset(dataset_id)

    x, y = zip(*[(mol["x"][str(fingerprint_size)], mol["y"][label]) for mol in data])
    x, y = np.array(x), np.array(y)

    model.compile(optimizer=tf.keras.optimizers.Adam(), loss=tf.keras.losses.MeanSquaredError(),
                  metrics=[tf.keras.metrics.MeanAbsoluteError()])

    model.build(input_shape=x.shape)
    model.summary()

    history = model.fit(x, y, epochs=1000, batch_size=64, verbose=1, use_multiprocessing=True)
    resulthandler.addNewModel(self, num_layers, dataset_id, units_per_layer, fingerprint_size, label,  history)


def make_prediction(model_id, molecule):
    result = model.predict(molecule)
    resulthandler.addNewMolecule(molecule, result)
