from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, Api, Resource

import storage_handler as sh
import ml_functions as ml

app = Flask(__name__)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('smiles')
parser.add_argument('name')
parser.add_argument('datasetID')
parser.add_argument('modelID')
parser.add_argument('fittingID')
parser.add_argument('fingerprint')
parser.add_argument('label')
parser.add_argument('epochs')
parser.add_argument('accuracy')
parser.add_argument('batchSize')
parser.add_argument('baseModel')



# modelList
# gets a list of all models, and lets you PATCH to add new models
class Models(Resource):
    def get(self, user_id):
        models = sh.get_model_summaries(user_id)
        fittings = sh.get_fitting_summaries(user_id)
        model_configs = []

        for key in models.keys():
            current_model = models[key]
            model_fittings = []
            for fitting_id in current_model['fittingIDs']:
                fitting = fittings.get(fitting_id)
                if fitting:  # convert fitting
                    model_fittings.append({
                        {
                            'id': fitting['name'],
                            'modelID': fitting['modelID'],
                            'modelName': current_model['name'],
                            'datasetID': fitting['datasetID'],
                            'epochs': fitting['epochs'],
                            'batchSize': fitting['batchSize'],
                            'accuracy': fitting['accuracy']
                        }
                    })
            model_configs.append({
                'id': key,
                'name': current_model['name'],
                'baseModel': current_model['baseModelID'],
                'parameters': current_model['parameters'],
                'fittings': model_fittings
            })
        return model_configs

    # called when a new configs is added
    def patch(self, user_id):
        args = parser.parse_args()
        return ml.create(user_id, args['name'], args['parameters'], args['baseModel'])

class Molecules(Resource):
    def get(self, user_id):
        return sh.get_molecules(user_id)

class Molecules(Resource):
    def get(self, user_id):
        molecules = sh.get_molecules(user_id)
        processed_molecules = []
        for smiles in molecules.keys():
            current_molecule = molecules.get(smiles)
            if current_molecule:
                processed_molecules.append({
                    'name': current_molecule['name'],
                    'smiles': smiles,
                    'analyses': current_molecule['analyses']
                })
        return processed_molecules

    def patch(self, user_id):
        args = parser.parse_args()
        return sh.add_molecule(user_id, args['smiles'], args['name'])


# TODO: Maybe remove again
class Fittings(Resource):
    def get(self, user_id):
        return sh.get_fitting_summaries(user_id)


class AddUser(Resource):
    def post(self):
        args = parser.parse_args()
        user_id = hash(args['username'])
        handler = sh.add_user_handler(user_id)
        if handler:
            return user_id, 201


class DeleteUser(Resource):
    def delete(self, user_id):
        return sh.delete_user_handler(user_id)


class Datasets(Resource):
    """
    :returns array of json objects containing dataset information
    """

    def get(self):
        datasets = sh.get_dataset_summaries
        processed_datasets = []
        for dataset_id in datasets.keys():
            current_dataset = datasets.get(dataset_id)
            if current_dataset:
                processed_datasets.append({
                    'name': current_dataset['name'],
                    'datasetID': dataset_id,
                    'size': current_dataset['size'],
                    'labelDescriptors': current_dataset['labelDescriptors'],
                })
        return processed_datasets


class BaseModels(Resource):
    def get(self):
        return sh.get_base_models()


class Analyze(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        return ml.analyze(user_id, args['fittingID'], args['smiles'])


# Creates a new fitting, adds that fitting to model
class Train(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        return ml.train(user_id, args['datasetID'], args['modelID'], args['fingerprint'], args['label'], args['epochs'],
                        args['accuracy'], args['batchSize'])


class Check(Resource):
    def get(self):
        return


# Actually set up the Api resource routing here
api.add_resource(AddUser, '/users')
api.add_resource(DeleteUser, '/users/<user_id>')
api.add_resource(Check, '/check')
api.add_resource(Models, '/users/<user_id>/models')
api.add_resource(Molecules, '/users/<user_id>/molecules')
api.add_resource(Fittings, '/users/<user_id>/fittings')
# Training & Analyzing
api.add_resource(Analyze, '/users/<user_id>/analyze')
api.add_resource(Train, '/users/<user_id>/train')
# Non-user-specific resources
api.add_resource(Datasets, '/datasets')
api.add_resource(BaseModels, '/baseModels')


def run(debug=True):
    app.run()


if __name__ == '__main__':
    test_user = 'yee'
    sh.add_user_handler(test_user)
    sh.add_molecule(test_user, 'aaah', 'name')  # For testing purposes
    sh.add_analysis(test_user, 'aaah', 5, {'god_why': 'help', 'number': 42, 'true': False})
    aa = ml.create(test_user, "name", {'units_per_layer': 256, 'optimizer': 'Adam', 'metrics': 'MeanSquaredError'},
                   'id')
    run()
