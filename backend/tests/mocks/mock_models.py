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

    def predict(self, predicted_thing):
        return self.prediction

class TrainMockModel(BasicMockModel):
    def __init__(self, prediction, metrics_names):
        super(prediction)
        self.metrics_names = metrics_names
        self.stop_training = False


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
