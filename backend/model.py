import storage_handler as sh


def train(user_id, dataset_id, model_id, fingerprint, label, epochs, accuracy, batch_size):
    dataset = sh.get_dataset(dataset_id)
    model = sh.get_model(user_id, model_id)

    # TODO: implement training (milestone for 26/08)
    fitting = None

    sh.add_fitting(user_id, dataset_id, epochs, accuracy, batch_size, model_id, fitting)


def analyze(user_id, fitting_id, molecule_id):
    fitting = sh.get_fitting(user_id, fitting_id)
    molecule = molecule_id  # TODO: Convert Molecule

    analysis = fitting.predict(molecule)
    sh.add_analysis(sh, molecule, fitting, analysis)
