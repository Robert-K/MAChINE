import keras.callbacks

import backend.utils.api as api
from backend.machine_learning import ml_dicts as mld
from backend.utils import storage_handler as sh

# Dictionary containing all current active training sessions
live_trainings = dict()


class Training:
    """
        Class for an active Training process.
        Holds all the information required to train a model and later save it in the storage_handler.
    """
    def __init__(self, user_id, dataset_id, model_id, labels, epochs, batch_size, fitting_id=None):
        model_summary = sh.get_model_summary(user_id, model_id)
        base_model = sh.get_base_model(model_summary.get('baseModelID'))

        self.user_id = user_id
        self.dataset_id = dataset_id
        self.model_id = model_id
        self.batch_size = int(batch_size)
        self.labels = labels
        self.model, ds = self.create_model_and_set(
            base_model.get('type'),
            model_summary.get('parameters'),
            sh.get_dataset(dataset_id),
            labels,
            base_model.get('metrics')
        )
        self.training_set, self.validation_set, self.test_set = self.split_dataset(ds)
        self.initial_epoch = 0
        self.fitting_id = fitting_id
        if fitting_id and sh.get_fitting_summary(user_id, fitting_id):
            self.model = sh.get_fitting(user_id, fitting_id)
            self.initial_epoch = sh.get_fitting_summary(user_id, fitting_id).get('epochs')
        self.epochs = int(epochs) + self.initial_epoch

    def create_model_and_set(self, model_type, parameters, dataset, labels, metrics):
        return mld.creation_functions.get(model_type)(parameters,
                                                      dataset,
                                                      labels,
                                                      mld.losses.get(parameters.get('lossFunction'))(),
                                                      mld.optimizers.get(parameters.get('optimizer'))(),
                                                      [mld.metrics.get(metric)() for metric in metrics],
                                                      self.batch_size)

    def split_dataset(self, dataset):
        """"
        shuffles and splits dataset into training (70%), validation(20%) and test (10%) data
        :param dataset: dataset to split
        """
        ds_length = dataset.cardinality().numpy()
        dataset_seed = hash(self.user_id) ^ hash(self.dataset_id) ^ hash(self.model_id) ^ hash(self.batch_size)
        ds = dataset.shuffle(max(int(ds_length * 0.1), 1), seed=dataset_seed)

        train_size = int(0.7 * ds_length)
        validation_size = int(0.2 * ds_length)

        return ds.take(train_size), ds.skip(train_size).take(validation_size), ds.skip(train_size + validation_size)

    def start_training(self):
        # Trains the model
        self.model.fit(self.training_set, validation_data=self.validation_set, epochs=self.epochs,
                       batch_size=self.batch_size,
                       callbacks=[LiveStats(self.user_id)],
                       initial_epoch=self.initial_epoch,
                       verbose=1)

    def evaluate_model(self):
        results = self.model.evaluate(self.test_set)
        names = self.model.metrics_names

        # Evaluates the model, saves result with metric names
        evaluation = dict(zip(names, results))

        # R2 is our replacement for accuracy
        # Thus every model needs to have R2 as a metric
        accuracy = round(evaluation.get('r_square') * 100, 2)
        return accuracy

    def stop_training(self):
        self.model.stop_training = True
        return self.model.stop_training


def train(user_id, dataset_id, model_id, labels, epochs, batch_size, fitting_id=None):
    if is_training_running(user_id):  # Change this to allow for more than one training at the same time
        return False
    # Placeholder here to ensure no other training can be started while we're initializing, as this takes a while
    live_trainings[user_id] = {'Placeholder'}
    try:
        new_training = Training(user_id, dataset_id, model_id, labels, epochs, batch_size, fitting_id)
    except (TypeError, AttributeError):
        del live_trainings[user_id]
        return False

    live_trainings[user_id] = new_training
    new_training.start_training()
    return True


def continue_training(user_id, fitting_id, epochs):
    summary = sh.get_fitting_summary(user_id, fitting_id)
    if summary:
        train(user_id, summary.get('datasetID'), summary.get('modelID'), summary.get('labels'), epochs,
              summary.get('batchSize'), fitting_id)
    return False


def stop_training(user_id):
    training = live_trainings.get(user_id, None)
    if training:
        return training.stop_training()
    return False


def is_training_running(user_id):
    # Change this & live_trainings dict to allow for more than one training at the same time
    return bool(live_trainings)


def analyze(user_id, fitting_id, smiles):
    """
    Analyzes given molecule using the fitting with given fitting_id
    :param user_id: id of calling user, required for user data storage access
    :param fitting_id: id of used fitting
    :param smiles: molecule encoded in SMILES formatted string
    :return: dictionary of molecules properties for each label of fitting
    """
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


class LiveStats(keras.callbacks.Callback):
    """
    class encapsulating training status and passing live training updates to api
    """
    def __init__(self, user_id):
        super().__init__()
        self.user_id = user_id
        self.epochs_trained = 0

    def on_epoch_end(self, epoch, logs=None):
        if logs is None:
            logs = {}
        # Increment our trained epochs counter
        self.epochs_trained = epoch + 1
        logs |= {"epoch": epoch}
        # Sends an update with the current training data (metric evaluation)
        api.update_training_logs(self.user_id, logs)

    def on_train_begin(self, logs=None):
        # Sends the api how many epochs the model is going to have been trained for
        epochs = live_trainings.get(self.user_id).epochs
        api.notify_training_start(self.user_id, epochs)

    def on_train_end(self, logs=None):
        finished_training = live_trainings.pop(self.user_id, None)
        if finished_training:
            accuracy = finished_training.evaluate_model()
            fitting_id = finished_training.fitting_id
            # Saves the trained model
            # if we're continuing training on an existing fitting, just update accuracy, epochs and the model itself
            if sh.get_user_handler(self.user_id):
                if finished_training.fitting_id:
                    fitting_id = sh.update_fitting(self.user_id, finished_training.fitting_id, self.epochs_trained,
                                                   accuracy, self.model)
                else:
                    fitting_id = sh.add_fitting(self.user_id,
                                                finished_training.dataset_id,
                                                finished_training.labels,
                                                self.epochs_trained,
                                                accuracy,
                                                finished_training.batch_size,
                                                finished_training.model_id,
                                                self.model)
            api.notify_training_done(self.user_id, fitting_id, self.epochs_trained, accuracy)
