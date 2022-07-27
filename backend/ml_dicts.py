import tensorflow as tf

optimizer = {
    'Adam': tf.keras.optimizers.Adam(),
}

loss = {
    'MeanSquaredError': tf.keras.losses.MeanSquaredError(),
}

metrics = {
    'MeanAbsoluteError': tf.keras.metrics.MeanAbsoluteError(),
}
