import tensorflow as tf
from backend.machine_learning.ml_gnns import create_schnet_with_dataset
from backend.machine_learning.ml_fnns import create_fnn_with_dataset

optimizer = {
    'Adam': tf.keras.optimizers.Adam(),
}

loss = {
    'MeanSquaredError': tf.keras.losses.MeanSquaredError(),
}

metrics = {
    'MeanAbsoluteError': tf.keras.metrics.MeanAbsoluteError(),
}

creation_functions = {
    'schnet': create_schnet_with_dataset,
    'sequential': create_fnn_with_dataset,
}