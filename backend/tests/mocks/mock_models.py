from pathlib import Path
import pickle


class BasicMockModel:
    def __init__(self, prediction):
        self.prediction = prediction

    def save(self, filepath):
        path = Path(filepath)
        file = path.open('wb')
        pickle.dump(self, file)
        file.close()


class TrainMockModel(BasicMockModel):
    def __init__(self, prediction=None, metrics_names=None, evaluation=None):
        super().__init__(prediction)
        self.metrics_names = metrics_names
        self.stop_training = False
        self.evaluation = evaluation

    def evaluate(self, *args, **kwargs):
        return self.evaluation

    def fit(self, *args, **kwargs):
        return 'a'

    def predict(self, predicted_thing, *args, **kwargs):
        return self.prediction


class BrokenMockModel:
    def __init__(self, content):
        self.content = content

    def save(self, filepath):
        raise NotImplementedError


def load_model(filepath):
    path = Path(filepath)
    if path.exists():
        file = path.open('rb')
        content = pickle.load(file)
        file.close()
        return content
