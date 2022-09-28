class MockTraining:
    def __init__(self, user_id=None, dataset_id=None, model_id=None, batch_size=None, labels=None, model=None,
                 datasets=None, initial_epoch=None, fitting_id=None, epochs=None, accuracy=None):
        if datasets is None:
            datasets = [None, None, None]

        self.user_id = user_id
        self.dataset_id = dataset_id
        self.model_id = model_id
        self.batch_size = batch_size
        self.labels = labels
        self.model = model
        self.training_set, self.validation_set, self.test_set = datasets
        self.initial_epoch = initial_epoch
        self.fitting_id = fitting_id
        self.epochs = epochs
        self.accuracy = accuracy

    def evaluate_model(self):
        return self.accuracy

    def start_training(self):
        return self.epochs

    def stop_training(self):
        return True
