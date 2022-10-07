import tensorflow as tf
import tensorflow_addons as tfa
from backend.machine_learning.ml_gnns import create_schnet_with_dataset, smiles_to_schnet_input
from backend.machine_learning.ml_fnns import create_fnn_with_dataset, smiles_to_fnn_input

"""
map of available optimizer names to their keras equivalent
"""
optimizers = {
    'Adam': tf.keras.optimizers.Adam,
    'Adamax': tf.keras.optimizers.Adamax,
    'Stochastic Gradient Descent': tf.keras.optimizers.SGD,
    'Nadam': tf.keras.optimizers.Nadam,
    'RMSprop': tf.keras.optimizers.RMSprop,
    'Adadelta': tf.keras.optimizers.Adadelta,
    'Adagrad': tf.keras.optimizers.Adagrad,
    'Ftrl': tf.keras.optimizers.Ftrl,
}

"""
map of available loss function names to their keras equivalent
"""
losses = {
    'Mean Absolute Error': tf.keras.losses.MeanAbsoluteError,
    'Mean Squared Error': tf.keras.losses.MeanSquaredError,
    'Binary Cross Entropy': tf.keras.losses.BinaryCrossentropy,
    'Huber Loss': tf.keras.losses.Huber,
}

"""
map of available metric names to their keras equivalent
"""
metrics = {
    'MeanAbsoluteError': tf.keras.metrics.MeanAbsoluteError,
    'Accuracy': tf.keras.metrics.Accuracy,
    'MeanAbsolutePercentageError': tf.keras.metrics.MeanAbsolutePercentageError,
    'R2': tfa.metrics.RSquare,
}

"""
map of available model types to their respective creation functions
"""
creation_functions = {
    'schnet': create_schnet_with_dataset,
    'sequential': create_fnn_with_dataset,
}

"""
map of available model types to their respective molecule conversion functions
"""
molecule_conversion_functions = {
    'schnet': smiles_to_schnet_input,
    'sequential': smiles_to_fnn_input,
}