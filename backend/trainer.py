from backend import storage_handler as sh


class Trainer:
    def __init__(self):
        self.dataset()
        self.model()
        # fingerprint and label and user are attributes here in case our handling of them changes in the future.
        # at the moment, they are not strictly necessary.
        self.fingerprint()
        self.label()
        self.user()
        self.fitting()

    def train(self, dataset_id, model_id, user_id, fingerprint, label):
        self.dataset = sh.get_dataset_info(dataset_id)
        self.model = sh.get_model(model_id)
        self.user = user_id
        self.fingerprint = fingerprint
        self.label = label

        # todo implement training (milestone for 26/08)
        self.fitting = None

        sh.add_fitting(sh, user_id, self.fitting)