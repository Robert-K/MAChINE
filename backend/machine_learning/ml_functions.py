import keras.callbacks

from backend.utils import storage_handler as sh
import backend.utils.api as api
from backend.machine_learning import ml_dicts as mld

# Dictionary containing all current active training sessions
live_trainings = dict()


class Training:
    def __init__(self, user_id, dataset_id, model_id, labels, epochs, batch_size):
        model_summary = sh.get_model_summary(user_id, model_id)
        base_model = sh.get_base_model(model_summary.get('baseModelID'))

        self.user_id = user_id
        self.dataset_id = dataset_id
        self.model_id = model_id
        self.epochs = int(epochs)
        self.batch_size = int(batch_size)
        self.labels = labels
        self.model, self.ds = self.create_model_and_set(
            base_model.get('type'),
            model_summary.get('parameters'),
            sh.get_dataset(dataset_id),
            labels,
            base_model.get('metrics')
        )

    def create_model_and_set(self, model_type, parameters, dataset, labels, metrics):
        return mld.creation_functions.get(model_type)(parameters,
                                                      dataset,
                                                      labels,
                                                      mld.losses.get(parameters.get('lossFunction'))(),
                                                      mld.optimizers.get(parameters.get('optimizer'))(),
                                                      [mld.metrics.get(metric)() for metric in metrics],
                                                      self.batch_size)

    def start_training(self):
        ds_length = self.ds.cardinality().numpy()
        ds = self.ds.shuffle(int(ds_length * 0.1))

        train_size = int(0.7 * ds_length)
        validation_size = int(0.2 * ds_length)

        training_set = ds.take(train_size)
        validation_set = ds.skip(train_size).take(validation_size)
        test_set = ds.skip(train_size + validation_size)

        # Trains the model
        self.model.fit(training_set, validation_data=validation_set, epochs=self.epochs,
                       batch_size=self.batch_size,
                       callbacks=[LiveStats(self.user_id)], verbose=1)

        results = self.model.evaluate(test_set)
        names = self.model.metrics_names

        # Evaluates the model, saves result with metric names
        evaluation = dict(zip(names, results))

        # R2 is our replacement for accuracy
        # Thus every model needs to have R2 as a metric
        accuracy = round(evaluation.get('r_square') * 100, 3)

        # Saves the trained model
        if sh.get_user_handler(self.user_id):
            sh.add_fitting(self.user_id, self.dataset_id, self.labels, self.epochs, accuracy, self.batch_size,
                           self.model_id, self.model)

    def stop_training(self):
        self.model.stop_training = True
        return self.model.stop_training


def train(user_id, dataset_id, model_id, labels, epochs, batch_size):
    if is_training_running(user_id):  # Change this to allow for more than one training at the same time
        return False
    new_training = Training(user_id, dataset_id, model_id, labels, epochs, batch_size)
    live_trainings[user_id] = new_training
    new_training.start_training()
    return True


def stop_training(user_id):
    training = live_trainings.pop(user_id, None)
    if training:
        return training.stop_training()
    return False


def is_training_running(user_id):
    # Change this & live_trainings dict to allow for more than one training at the same time
    return bool(live_trainings.get(user_id))


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


class LiveStats(keras.callbacks.Callback):
    def __init__(self, user_id):
        super().__init__()
        self.user_id = user_id

    def on_epoch_end(self, epoch, logs=None):
        if logs is None:
            logs = {}

        logs |= {"epoch": epoch}
        api.update_training_logs(self.user_id, logs)

    def on_train_begin(self, logs=None):
        api.notify_training_start(self.user_id)

    def on_train_end(self, logs=None):
        live_trainings.pop(self.user_id, None)
        api.notify_training_done(self.user_id)
