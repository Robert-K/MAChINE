#inspired by André

import numpy as np
import tensorflow as tf
import datasets as ds



n_units_per_layer = 256
fingerprint_size = 128
label = "homo"

fittedModel = 0

def fitModel(self, numLayers, datasetID):



    #André Code, but with variable amount of Layers
    layers = [];
    for i  in range(0, numLayers - 2):
        layers[i] = tf.keras.layers.Dense(units=n_units_per_layer, activation="relu")
    layers[numLayers - 1] = tf.keras.layers.Dense(units=1)
    model = tf.keras.models.sequential(layers)

    #managing the access to datasets got moved to separate class,
    data = ds.getDataset(datasetID)
    #Strg+C, Strg+V from André
    x, y = zip(*[(mol["x"][str(fingerprint_size)], mol["y"][label]) for mol in data])
    x, y = np.array(x), np.array(y)

    model.compile(optimizer=tf.keras.optimizers.Adam(), loss=tf.keras.losses.MeanSquaredError(),
                  metrics=[tf.keras.metrics.MeanAbsoluteError()])

    model.build(input_shape=x.shape)
    model.summary()

    self.fittedModel = model.fit(x, y, epochs=1000, batch_size=64, verbose=1)
    #how are we using this now? does model.fit() even return a value at all?
    #I don't need answers, I need sleep!