from pathlib import Path
import pickle


class BasicMockModel:
    def __init__(self, content):
        self.content = content

    def save(self, filepath):
        path = Path(filepath)
        file = path.open('wb')
        pickle.dump(self, file)
        file.close()


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
