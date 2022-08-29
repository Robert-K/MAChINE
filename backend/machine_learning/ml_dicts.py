import tensorflow as tf
from backend.machine_learning.ml_gnns import create_schnet_with_dataset, smiles_to_mol_graph
from backend.machine_learning.ml_fnns import create_fnn_with_dataset, smiles_to_fingerprint

optimizers = {
    'Adam': tf.keras.optimizers.Adam(),
}

losses = {
    'MeanSquaredError': tf.keras.losses.MeanSquaredError(),
}

metrics = {
    'MeanAbsoluteError': tf.keras.metrics.MeanAbsoluteError(),
}

creation_functions = {
    'schnet': create_schnet_with_dataset,
    'sequential': create_fnn_with_dataset,
}

molecule_conversion_functions = {
    'schnet': smiles_to_mol_graph,
    'sequential': smiles_to_fingerprint,
}