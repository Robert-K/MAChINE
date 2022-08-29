import keras.callbacks

from backend.utils import storage_handler as sh
import tensorflow as tf
import numpy as np
import backend.utils.api as api
from backend.machine_learning import ml_dicts as mld

def train(user_id, dataset_id, model_id, labels, epochs, batch_size):
    # Creates a new model and datasets, gets all the needed parameters
    dataset = sh.get_dataset(dataset_id)
    model_summary = sh.get_model_summary(user_id, model_id)
    parameters = model_summary.get('parameters')
    base_model = sh.get_base_model(model_summary.get('baseModelID'))
    model, ds = mld.creation_functions.get(base_model.get('type'))(model_summary.get('parameters'),
                                                                   dataset,
                                                                   labels,
                                                                   mld.losses.get(parameters.get('loss')),
                                                                   mld.optimizers.get(parameters.get('optimizer')),
                                                                   mld.metrics.get(base_model.get('metric')),
                                                                   batch_size)
    # Prints a model summary, can be removed
    model.summary()

    # Trains the model

    model.fit(ds, epochs=int(epochs), batch_size=int(batch_size), callbacks=[LiveStats()], verbose=0)
    api.noticeDone()
    # Saves the trained model
    return sh.add_fitting(user_id, dataset_id, epochs, 0, batch_size, model_id, model)


def analyze(user_id, fitting_id, model_id, smiles):
    fitting = sh.get_fitting(user_id, fitting_id)
    model_summary = sh.get_model_summary(user_id, model_id)
    base_model = sh.get_base_model(model_summary.get('baseModelID'))

    converted_molecule = mld.molecule_conversion_functions.get(base_model.get('type'))(smiles)
    fitting.summary()
    converted_molecule = tf.constant(converted_molecule)
    analysis = fitting.predict(converted_molecule)
    print('analysis')
    sh.add_analysis(sh, smiles, fitting, analysis)


class LiveStats(keras.callbacks.Callback):

    def on_epoch_end(self, epoch, logs={}):
        api.update(logs)
