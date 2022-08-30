import json
from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, Api, Resource
import hashlib
import eventlet as el
from flask_socketio import SocketIO, send, emit
from backend.utils import storage_handler as sh
from backend.machine_learning import ml_functions as ml

app = Flask(__name__)
cors = CORS(app)
api = Api(app)
sio = SocketIO(app, cors_allowed_origins='*', async_mode="eventlet")

parser = reqparse.RequestParser()
parser.add_argument('username')
parser.add_argument('smiles')
parser.add_argument('cml')
parser.add_argument('name')
parser.add_argument('datasetID')
parser.add_argument('modelID')
parser.add_argument('fittingID')
parser.add_argument('labels')
parser.add_argument('epochs', type=int)
parser.add_argument('accuracy')
parser.add_argument('batchSize', type=int)
parser.add_argument('baseModel')


# modelList
# gets a list of all models, and lets you PATCH to add new models
class Models(Resource):
    def get(self, user_id):
        models = sh.get_model_summaries(user_id)
        model_configs = []

        for key in models.keys():
            current_model = models[key]
            model_fittings = []
            for fitting_id in current_model['fittingIDs']:
                fitting = sh.get_fitting_summary(user_id, fitting_id)
                if fitting:  # convert fitting
                    model_fittings.append(
                        {
                            'id': fitting_id,
                            'modelID': fitting['modelID'],
                            'modelName': current_model['name'],
                            'datasetID': fitting['datasetID'],
                            'labels': fitting['labels'],
                            'epochs': fitting['epochs'],
                            'batchSize': fitting['batchSize'],
                            'accuracy': fitting['accuracy']
                        }
                    )
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
        return sh.add_model(user_id, args['name'], args['parameters'], args['baseModel'])


class Molecules(Resource):
    def get(self, user_id):
        # Gets all molecules and creates a new array to hold the converted molecules
        molecules = sh.get_molecules(user_id)
        processed_molecules = []

        for smiles in molecules.keys():
            current_molecule = molecules.get(smiles)
            # Creates new array for converted analyses
            analyses = []
            for fitting_id in current_molecule['analyses']:
                # Goes through every analysis, gets the fitting summary to get its modelID
                current_analysis = current_molecule['analyses'].get(fitting_id)
                fitting_summary = sh.get_fitting_summary(user_id, fitting_id)
                model_name = 'error'
                if fitting_summary:
                    # Uses that modelID to get a model to get its name
                    model_summary = sh.get_model_summary(user_id, fitting_summary.get('modelID'))
                    model_name = model_summary.get('name')
                # Appends the converted analysis to the array
                analyses.append({
                    'modelName': model_name,
                    'fittingID': fitting_id,
                    'results': current_analysis,
                })
            # Converts the molecule
            processed_molecules.append({
                'name': current_molecule['name'],
                'smiles': smiles,
                'cml': current_molecule['cml'],
                'analyses': analyses,
            })
        return processed_molecules, 200

    def patch(self, user_id):
        args = parser.parse_args()
        return sh.add_molecule(user_id, args['smiles'], args['cml'], args['name']), 201


class Fittings(Resource):
    def get(self, user_id):
        fittings = sh.get_fitting_summaries(user_id)
        processed_fittings = []
        for fitting_id in fittings.keys():
            current_fitting = fittings.get(fitting_id)
            model_name = 'n/a'
            model = sh.get_model_summary(user_id, current_fitting.get('modelID'))
            if model:
                model_name = model['name']
            processed_fittings.append(
                {
                    'id': fitting_id,
                    'modelID': current_fitting['modelID'],
                    'modelName': model_name,
                    'datasetID': current_fitting['datasetID'],
                    'labels': current_fitting['labels'],
                    'epochs': current_fitting['epochs'],
                    'batchSize': current_fitting['batchSize'],
                    'accuracy': current_fitting['accuracy']
                }
            )
        return processed_fittings


class AddUser(Resource):
    def post(self):
        args = parser.parse_args()
        user_id = str(hashlib.sha1(args['username'].encode('utf-8'), usedforsecurity=False).hexdigest())
        handler = sh.add_user_handler(user_id)
        if handler:
            return {'userID': user_id}, 201
        return 404


class DeleteUser(Resource):
    def delete(self, user_id):
        if sh.get_user_handler(user_id):
            sh.delete_user_handler(user_id)
            return 200 if sh.get_user_handler(user_id) is None else 500
        return 404


class Datasets(Resource):
    """
    :returns array of json objects containing dataset information
    """

    def get(self):
        datasets = sh.get_dataset_summaries()
        processed_datasets = []
        for dataset_id in datasets.keys():
            current_dataset = datasets.get(dataset_id)
            if current_dataset:
                processed_datasets.append({
                    'name': current_dataset['name'],
                    'datasetID': dataset_id,
                    'size': current_dataset['size'],
                    'labelDescriptors': current_dataset['labelDescriptors'],
                    'image': current_dataset['image'],
                })
        return processed_datasets


class BaseModels(Resource):
    def get(self):
        models = sh.get_base_models()
        processed_models = []
        for model_id in models.keys():
            current = models.get(model_id)
            if current:
                processed_model = dict()

                # add type-universal entries
                processed_model['name'] = current.get('name')
                processed_model['id'] = model_id
                processed_model_type = dict()
                processed_model_type['name'] = current.get('type')
                processed_model_type['image'] = current.get('image')
                processed_model['type'] = processed_model_type

                # add type-specific entries
                processed_model_parameters = dict()
                if current.get('type') == 'sequential':
                    layers = current.get('layers')
                    if layers:
                        processed_model['taskType'] = 'regression' if layers[len(layers) - 1].get(
                            'units') == 1 else 'classification'
                        processed_model_parameters['layers'] = layers
                    processed_model_parameters['lossFunction'] = current.get('lossFunction')
                    processed_model_parameters['optimizer'] = current.get('optimizer')

                elif current.get('type') == 'schnet':
                    processed_model['taskType'] = 'regression'
                    processed_model_parameters['depth'] = current.get('depth')
                    processed_model_parameters['embeddingDimension'] = current.get('embeddingDimension')
                    processed_model_parameters['readoutSize'] = current.get('readoutSize')

                processed_models.append(processed_model)
        return processed_models


class Analyze(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        return ml.analyze(user_id, args['fittingID'], args['smiles'])


# Creates a new fitting, adds that fitting to model
class Train(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        labels = json.loads(args['labels'])
        return ml.train(user_id, args['datasetID'], args['modelID'], labels, args['epochs'], args['batchSize'])


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


# SocketIO event listeners
@sio.on('ping')
def handle_ping(data):
    sio.emit('pong', data + 'copy')


def update(logs):
    sio.emit('update', logs)
    el.sleep(0)

def noticeDone():
    sio.emit('done')

def run(debug=True):
    # Lots of dummy data
    # TODO: Remove
    test_user = str(hashlib.sha1('Tom'.encode('utf-8'), usedforsecurity=False).hexdigest())
    # test_user = str(hash('yee'))
    sh.add_user_handler(test_user)
    sh.add_molecule(test_user, 'Clc(c(Cl)c(Cl)c1C(=O)O)c(Cl)c1Cl',
                    '<cml xmlns=\"http://www.xml-cml.org/schema\"><molecule id=\"m1\"><atomArray><atom id=\"a1\" elementType=\"C\" x2=\"14.04999999999995\" y2=\"46.39999999999984\"/><atom id=\"a2\" elementType=\"C\" isotope=\"13\" x2=\"13.35999999999995\" y2=\"45.999999999999844\"/><atom id=\"a5\" elementType=\"C\" x2=\"14.739999999999949\" y2=\"45.19999999999985\"/><atom id=\"a6\" elementType=\"C\" x2=\"14.739999999999949\" y2=\"45.999999999999844\"/><atom id=\"a7\" elementType=\"R\" x2=\"15.43999999999995\" y2=\"46.39999999999984\"/></atomArray><bondArray><bond id=\"b1\" order=\"S\" atomRefs2=\"a1 a2\"/><bond id=\"b5\" order=\"S\" atomRefs2=\"a5 a6\"/><bond id=\"b6\" order=\"D\" atomRefs2=\"a6 a1\"/><bond id=\"b7\" order=\"S\" atomRefs2=\"a6 a7\"/></bondArray></molecule></cml>',
                    'MySuperCoolMolecule')
    # For testing purposes
    model_id = sh.add_model(test_user, 'MyCoolModel', {'layers': [
        {
            'type': 'dense',
            'units': 256,
            'activation': 'relu',
        },
        {
            'type': 'dense',
            'units': 256,
            'activation': 'relu',
        }
    ], 'loss': 'MeanSquaredError', 'optimizer': 'Adam'}, 'id')
    fitting_id = ml.train(test_user, '1', model_id, ['HIV_active'], 0, 64)
    # fitting_id_1 = sh.add_fitting(test_user, '0', 2, 0.25, 125, model_id, ml.train(test_user))
    # fitting_id_2 = sh.add_fitting(test_user, '0', 6000, 5.05, 5, model_id, )
    # print(fitting_id_1, fitting_id_2)
    # sh.add_analysis(test_user, 'Clc(c(Cl)c(Cl)c1C(=O)O)c(Cl)c1Cl', fitting_id_1, {'lumo': -7.152523})
    # sh.add_analysis(test_user, 'Clc(c(Cl)c(Cl)c1C(=O)O)c(Cl)c1Cl', fitting_id_2, {'homo': 1.5254})
    print(test_user)
    sio.run(app)


if __name__ == '__main__':
    run()
