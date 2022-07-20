import storage_handler as sh

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

        # TODO: Analyze Molecule

        self.analysis = None


