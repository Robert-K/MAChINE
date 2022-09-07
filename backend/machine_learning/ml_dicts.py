import tensorflow as tf
import tensorflow_addons as tfa
from backend.machine_learning.ml_gnns import create_schnet_with_dataset, smiles_to_schnet_input
from backend.machine_learning.ml_fnns import create_fnn_with_dataset, smiles_to_fnn_input

optimizers = {
    'Adam': tf.keras.optimizers.Adam(),
    'Adamax': tf.keras.optimizers.Adamax(),
    'Stochastic Gradient Descent': tf.keras.optimizers.SGD(),
    'Nadam': tf.keras.optimizers.Nadam(),
}

losses = {
    'Mean Absolute Error': tf.keras.losses.MeanAbsoluteError(),
    'Mean Squared Error': tf.keras.losses.MeanSquaredError(),
    'Binary Cross Entropy': tf.keras.losses.BinaryCrossentropy(),
    'Huber Loss': tf.keras.losses.Huber(),
}

metrics = {
    'MeanAbsoluteError': tf.keras.metrics.MeanAbsoluteError(),
    'Accuracy': tf.keras.metrics.Accuracy(),
    'MeanAbsolutePercentageError': tf.keras.metrics.MeanAbsolutePercentageError(),
    'R2': tfa.metrics.RSquare(),
}

creation_functions = {
    'schnet': create_schnet_with_dataset,
    'sequential': create_fnn_with_dataset,
}

molecule_conversion_functions = {
    'schnet': smiles_to_schnet_input,
    'sequential': smiles_to_fnn_input,
}