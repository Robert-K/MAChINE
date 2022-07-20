from backend import storage_handler as sh


class Trainer:
    def __init__(self):
        self.dataset()
        self.user()
        self.model()
        self.fingerprint()
        self.label()

    def train(self, dataset_id, model_id, user_id, fingerprint, label):
        self.dataset = sh.get_dataset(dataset_id)
        self.user = sh.get_user(user_id)