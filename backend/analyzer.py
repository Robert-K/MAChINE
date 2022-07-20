import storage_handler as sh
import tensorflow as tf

class Analyzer:
    def __init__(self):
        self.user()
        self.fitting()
        self.molecule()
        self.analysis()

    def analyze(self, user_id, fitting_id, molecule_id):
        self.user = user_id
        self.fitting = sh.get_fitting(user_id, fitting_id)
        self.molecule = molecule_id

        self.analysis = self.fitting.predict(self.molecule)
        sh.add_analysis(sh, self.molecule, self.fitting, self.analysis)