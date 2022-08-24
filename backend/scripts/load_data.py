# Copyright André Eberhard 2022 | All rights reserved. 🥇

import json
import pickle

import numpy as np
import tensorflow as tf

with open("data.pkl", "rb") as f:
    data = pickle.load(f)

# data is stored as string, parse it first
data = [json.loads(x) for x in data]

n_units_per_layer = 256
fingerprint_size = 128
label = "homo"

# each data row has inputs of different sizes (x) and outputs for different target properties (y)
# separate them and convert to numpy arrays which are handled by Tensorflow out-of-the-box
x, y = zip(*[(mol["x"][str(fingerprint_size)], mol["y"][label]) for mol in data])
x, y = np.array(x), np.array(y)

# sequential models are of the simplest form, the model simply accepts an array of layers, rest is
# inferred by Tensorflow
model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
    tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
    tf.keras.layers.Dense(units=n_units_per_layer, activation="relu"),
    tf.keras.layers.Dense(units=1)
])

# compile sets optimizer and loss which both are needed for parameter optimization
model.compile(optimizer=tf.keras.optimizers.Adam(), loss=tf.keras.losses.MeanSquaredError(),
              metrics=[tf.keras.metrics.MeanAbsoluteError()])

# the number of parameters of the first layer depends on the input size
model.build(input_shape=x.shape)
model.summary()

if __name__ == '__main__':
    # train the model
    model.fit(x, y, epochs=1000, batch_size=64, verbose=1)
