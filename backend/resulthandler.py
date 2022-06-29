models=[]
molecules=[]


def addNewModel(self, num_layers, dataset_id, units_per_layer, fingerprint_size, label, history):
    id = len(models)
    models.insert({id, self, num_layers, dataset_id, units_per_layer, fingerprint_size, label, history})
    return id

def addNewMolecule(molecule):
    id = len(molecules)
    molecules.insert(id, molecule)
    return id

def getmodels():
    return 0

def getmoleculs():
    return 0