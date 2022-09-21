import keras.callbacks

from backend.utils import storage_handler as sh
import backend.utils.api as api
from backend.machine_learning import ml_dicts as mld

abort = False


def train(user_id, dataset_id, model_id, labels, epochs, batch_size):
    # Creates a new model and datasets, gets all the needed parameters
    dataset = sh.get_dataset(dataset_id)
    model_summary = sh.get_model_summary(user_id, model_id)
    parameters = model_summary.get('parameters')
    base_model = sh.get_base_model(model_summary.get('baseModelID'))
    metrics = base_model.get('metrics')
    model, ds = mld.creation_functions.get(base_model.get('type'))(model_summary.get('parameters'),
                                                                   dataset,
                                                                   labels,
                                                                   mld.losses.get(parameters.get('loss')),
                                                                   mld.optimizers.get(parameters.get('optimizer')),
                                                                   [mld.metrics.get(metric) for metric in metrics],
                                                                   batch_size)
    # Prints a model summary, can be removed
    model.summary()

    # Split dataset into training and validation
    dataset_size = len(dataset)
    train_size = int(0.7 * dataset_size)

    training_set = ds.take(train_size)
    validation_set = ds.skip(train_size)
    # Trains the model

    model.fit(training_set, validation_data=validation_set, epochs=int(epochs), batch_size=int(batch_size), callbacks=[LiveStats(), Abort()], verbose=1)
    api.notice_done()
    # Saves the trained model
    return sh.add_fitting(user_id, dataset_id, labels, epochs, 0, batch_size, model_id, model)


def analyze(user_id, fitting_id, smiles):
    # Gets required objects
    fitting = sh.get_fitting(user_id, fitting_id)
    fitting_summary = sh.get_fitting_summary(user_id, fitting_id)
    model_summary = sh.get_model_summary(user_id, fitting_summary.get('modelID'))
    base_model = sh.get_base_model(model_summary.get('baseModelID'))

    # Converts the molecule to the needed format
    converted_molecule = mld.molecule_conversion_functions.get(base_model.get('type'))(smiles)

    # Analyses the molecule
    analysis_results = fitting.predict(converted_molecule).flatten().tolist()

    # Converts the analysis to a dictionary
    formatted_analysis = dict()
    for (x, y) in zip(*[fitting_summary.get('labels'), analysis_results]):
        formatted_analysis |= {x: y}

    # Saves the new analysis
    sh.add_analysis(user_id, smiles, fitting_id, formatted_analysis)
    return formatted_analysis


def get_abort():
    return abort


def set_abort(val):
    global abort
    abort = val


class LiveStats(keras.callbacks.Callback):

    def on_epoch_end(self, epoch, logs={}):
        api.update(logs)


class Abort(keras.callbacks.Callback):

    def on_epoch_end(self, epoch, logs={}):
        print(get_abort())
        if get_abort():
            self.model.stop_training = True
            print("CHECK")
            set_abort(False)
