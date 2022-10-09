import hashlib
import json
import sched
import time

from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, Api, Resource
from flask_socketio import SocketIO

from backend.machine_learning import ml_functions as ml
from backend.utils import molecule_formats as mf
from backend.utils import storage_handler as sh

app = Flask(__name__)
cors = CORS(app)
api = Api(app)
sio = SocketIO(app, cors_allowed_origins='*', async_mode="threading", logger=bool(__debug__), engineio_logger=bool(__debug__))

scheduler = sched.scheduler(time.time, sio.sleep)

"""
declaration of request arguments
"""
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
parser.add_argument('accuracy', type=float)  # Not used
parser.add_argument('batchSize', type=int)
parser.add_argument('baseModelID')
parser.add_argument('parameters', type=dict)


class Models(Resource):
    """
    GET a list of all models for given user ID
    PATCH to add new models to user data
    """
    def get(self, user_id):
        """
        Get a list of all models in data of user with given ID
        :param user_id: string containing user ID
        :return: list of model descriptions (dictionaries containing defining values)
        """
        models = sh.get_model_summaries(user_id)
        model_configs = []
        # Goes through every model_config for a user and converts it to the frontend format
        for key in models.keys():
            current_model = models[key]
            current_base_model = sh.get_base_model(current_model['baseModelID'])
            model_fittings = []
            # Goes through every fitting associated with the model_config and adds that to the sent data
            for fitting_id in current_model['fittingIDs']:
                fitting = sh.get_fitting_summary(user_id, fitting_id)
                if fitting:  # convert fitting
                    dataset = sh.get_dataset_summaries().get(fitting['datasetID'])
                    model_fittings.append(
                        {
                            'id': fitting_id,
                            'modelID': fitting['modelID'],
                            'modelName': current_model['name'],
                            'datasetID': fitting['datasetID'],
                            'datasetName': dataset['name'],
                            'labels': fitting['labels'],
                            'epochs': fitting['epochs'],
                            'batchSize': fitting['batchSize'],
                            'accuracy': fitting['accuracy']
                        }
                    )
            model_configs.append({
                'id': key,
                'name': current_model['name'],
                'baseModelID': current_model['baseModelID'],
                'baseModelName': current_base_model['name'],
                'parameters': current_model['parameters'],
                'fittings': model_fittings
            })
        return model_configs

    # called when a new configs is added
    def patch(self, user_id):
        """
        Add a model to storage using name, parameters and baseModelID-arguments
        :param user_id: string containing user ID
        :return: string of added model's ID
        """
        args = parser.parse_args()
        return sh.add_model(user_id, args['name'], args['parameters'], args['baseModelID']), 201


class Molecules(Resource):
    """
    GET a list of all molecules for given user ID
    PATCH to add new molecules to user data
    """
    def get(self, user_id):
        """
        Gets all molecules in storage of user with given user ID and converts them to frontend compatible format
        :param user_id: string containing user ID
        :return: list of molecules (dictionaries with name, smiles code, cml and available analyses)
        """
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
        """
        Add molecule from smiles-argument to data of user with given ID, if it is a valid smiles code
        :param user_id: string containing user ID
        :return: appropriate code
        """
        args = parser.parse_args()
        smiles = args['smiles']
        # Only actually add molecules if Chem can handle the smiles code. Prevents errors further down the line
        if mf.is_valid_molecule(smiles):
            return sh.add_molecule(user_id, args['smiles'], args['cml'], args['name']), 201
        return None, 422


class Fittings(Resource):
    """
    GET a list of all fittings for given user ID
    """
    def get(self, user_id):
        """
        Gets fittings from user with given user ID and converts each to frontend-compatible format
        :param user_id: string containing user ID
        :return: list of fittings (dictionaries containing summary data)
        """
        # Converts every fitting a user has to the frontend format and sends it over
        fittings = sh.get_fitting_summaries(user_id)
        processed_fittings = []
        for fitting_id in fittings.keys():
            current_fitting = fittings.get(fitting_id)
            current_dataset = sh.get_dataset_summaries().get(current_fitting['datasetID'])
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
                    'datasetName': current_dataset['name'],
                    'labels': current_fitting['labels'],
                    'epochs': current_fitting['epochs'],
                    'batchSize': current_fitting['batchSize'],
                    'accuracy': current_fitting['accuracy']
                }
            )
        return processed_fittings


class Scoreboard(Resource):
    """
    GET current contents of the scoreboard
    DELETE fitting with given ID from scoreboard. If no ID is given, delete all fittings from scoreboard
    """
    def get(self):
        """
        GET current contents of the scoreboard
        :return:
        """
        return list(sh.get_scoreboard_summaries().values())

    def delete(self, fitting_id=None):
        """
        DELETE fitting with given ID from scoreboard
        If no ID is given, delete all fittings from scoreboard
        :param fitting_id: String ID of fitting to delete, or None
        :return: void
        """
        # call so /scoreboards deletes everything to /scoreboards/<id> deletes a single fitting
        if fitting_id is None:
            return sh.delete_scoreboard_fittings()
        else:
            return sh.delete_scoreboard_fitting(fitting_id)


class User(Resource):
    """
    POST a new user
    DELETE a user with given id
    """
    def post(self):
        """
        Add a new user
        Generate an ID, add new user storage containing example model and molecule
        :return: string containing new user's ID
        """
        args = parser.parse_args()
        # Create the user_id
        user_id = str(hashlib.sha1(args['username'].encode('utf-8'), usedforsecurity=False).hexdigest())
        # This line means that if a user forgets to log out that username is blocked from there on
        if sh.get_user_handler(user_id) and not bool(__debug__):
            return None, 409
        handler = sh.add_user_handler(user_id, args['username'])
        if handler:
            # Add example molecules & models
            # Hardcoded basemodel & dataset ID, change if breaks
            sh.add_molecule(user_id,
                            'O',
                            '<cml xmlns="http://www.xml-cml.org/schema"><molecule '
                            'id="m1"><atomArray><atom id="a1" elementType="H" x2="14.266666666666667" '
                            'y2="54.4"/><atom id="a2" elementType="O" x2="15.132692070451107" '
                            'y2="54.9"/><atom id="a4" elementType="H" x2="15.998717474235546" '
                            'y2="54.4"/></atomArray><bondArray><bond id="b1" order="S" atomRefs2="a1 '
                            'a2"/><bond id="b3" order="S" atomRefs2="a2 '
                            'a4"/></bondArray></molecule></cml>',
                            'Water')

            example_model_id = sh.add_model(user_id, 'Example Model',
                                            {'layers': [
                                                {
                                                    'type': 'dense',
                                                    'units': 5,
                                                    'activation': 'relu',
                                                },
                                                {
                                                    'type': 'dense',
                                                    'units': 2,
                                                    'activation': 'linear',
                                                },
                                                {
                                                    'type': 'dense',
                                                    'units': 12,
                                                    'activation': 'relu',
                                                }],
                                                'lossFunction': 'Huber Loss',
                                                'optimizer': 'Stochastic Gradient Descent'}, '1')
        
            return {'userID': user_id}, 201
        return None, 404

    def delete(self, user_id):
        """
        Delete storage of user with given ID
        :param user_id: String containing ID of user to be deleted
        :return: int, status code depending on failure or success of deletion
        """
        if sh.get_user_handler(user_id):
            sh.delete_user_handler(user_id)
            return (None, 200) if sh.get_user_handler(user_id) is None else (None, 500)
        return None, 404


class Datasets(Resource):
    """
    GET a list of descriptions of available datasets
    """
    def get(self):
        """
        Converts the stored Dataset summaries to the frontend format
        :return: converted array containing datasets & their properties
        """
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
                })
        return processed_datasets


class Histograms(Resource):
    def get(self, dataset_id, labels):
        """
        GET a dictionary of histograms of given dataset for each given label
        :param dataset_id: string, ID of dataset
        :param labels: string containing comma-separated labels
        :return: dictionary with label-histogram entries; histograms are dictionaries with keys binEdges and buckets
        """
        separated_labels = labels.split(',')
        histograms = sh.get_dataset_histograms(dataset_id, separated_labels)
        for hist in histograms.values():
            hist['binEdges'] = list(hist.get('bin_edges'))
            del hist['bin_edges']
        return histograms


class BaseModels(Resource):
    """
    GET a list of available base models
    """
    def get(self):
        """
        Converts the stored base model to the frontend format
        :return: converted array containing base models
        """
        models = sh.get_base_models()
        processed_models = []
        for model_id, current in models.items():
            if current:
                processed_model = dict(current)
                processed_model['id'] = model_id
                del processed_model['metrics']

                # add model type object
                processed_model_type = dict()
                processed_model_type['name'] = current.get('type')
                processed_model['type'] = processed_model_type

                # add task type
                if current.get('type') == 'sequential':
                    layers = current.get('parameters').get('layers')
                    if layers:
                        processed_model['taskType'] = 'regression' if layers[len(layers) - 1].get(
                            'units') == 1 else 'classification'

                elif current.get('type') == 'schnet':
                    processed_model['taskType'] = 'regression'

                processed_models.append(processed_model)
        return processed_models


class Analyze(Resource):
    def post(self, user_id):
        """
        Analyze molecule in smiles-argument using fitting with ID from the fittingID-argument
        Pass the given user ID to add new analysis to the molecule in referenced user's storage
        :param user_id: String ID of referenced user
        :return: dictionary containing analyzed properties by label
        """
        args = parser.parse_args()
        return ml.analyze(user_id, args['fittingID'], args['smiles'])


class Train(Resource):
    """
    POST the start of a new training
    PATCH the continuance of an existing training
    DELETE the current training
    """
    def post(self, user_id):
        """
        Initiates a new training from given arguments
        :param user_id: String, ID whose model is being fitted
        :return: Boolean whether initiation was successful
        """
        if ml.is_training_running(user_id):
            return False, 503
        # Axios can't send arrays for some reason, => array converted to json string in frontend, back to array in here
        args = parser.parse_args()
        labels = json.loads(args['labels'])
        # Starts the training as a background task to allow the server to respond to other requests while training
        sio.start_background_task(target=ml.train,
                                  user_id=user_id,
                                  dataset_id=args['datasetID'],
                                  model_id=args['modelID'],
                                  labels=labels,
                                  epochs=args['epochs'],
                                  batch_size=args['batchSize'])
        return True, 200

    def patch(self, user_id):
        """
        Continue training in the studio if there is no other training
        Initiates socket IO's back ruft wieder
        :param user_id: String, ID als Userin f
        :return: String, Int error code
        """
        args = parser.parse_args()

        if ml.is_training_running(user_id):
            return 0, 503

        # Continues training if fitting with that ID exists
        fitting_summary = sh.get_fitting_summary(user_id, args['fittingID'])
        if not bool(fitting_summary):
            return 0, 404

        sio.start_background_task(target=ml.continue_training,
                                  user_id=user_id,
                                  fitting_id=args['fittingID'],
                                  epochs=args['epochs'])
        return (fitting_summary.get('epochs') + args['epochs']), 200

    def delete(self, user_id):
        """
        Abort training if it is running
        :param user_id: String ID of user wanting to stop their training
        :return: Boolean whether deletion was successful, int error code
        """
        return (True, 200) if ml.stop_training(user_id) else (False, 404)


# Actually set up the Api resource routing here
api.add_resource(User, '/users', '/users/<user_id>')
api.add_resource(Models, '/users/<user_id>/models')
api.add_resource(Molecules, '/users/<user_id>/molecules')
api.add_resource(Fittings, '/users/<user_id>/fittings')
# Training & Analyzing
api.add_resource(Analyze, '/users/<user_id>/analyze')
api.add_resource(Train, '/users/<user_id>/train')
# Non-user-specific resources
api.add_resource(Scoreboard, '/scoreboard/<fitting_id>', '/scoreboard')
api.add_resource(Datasets, '/datasets')
api.add_resource(Histograms, '/histograms/<dataset_id>/<labels>')
api.add_resource(BaseModels, '/baseModels')


# SocketIO event listeners/senders
def update_training_logs(user_id, logs):
    # Schedules updates 0.3 secs apart at least
    scheduler.enter(0.3 * (len(scheduler.queue) + 1),
                    2,
                    sio.emit,
                    ('update', {user_id: logs}))
    # blocking is required to schedule messages correctly, but can't block main process
    # Starts the scheduler as a blocking background task
    sio.start_background_task(scheduler.run, blocking=True)


def notify_training_done(user_id, fitting_id, epochs_trained, accuracy):
    scheduler.enter(0.3 * (len(scheduler.queue) + 1),
                    2,
                    sio.emit,
                    ('done', {user_id: {'fittingID': fitting_id, 'epochs': epochs_trained, 'accuracy': accuracy}}))
    sio.start_background_task(scheduler.run, blocking=True)


def notify_training_start(user_id, epochs):
    scheduler.empty()
    sio.emit('started', {user_id: epochs})


def run(debug=True):
    # Lots of dummy data for debugging
    if bool(__debug__):
        test_user = str(hashlib.sha1('Tom'.encode('utf-8'), usedforsecurity=False).hexdigest())
        test_user2 = str(hashlib.sha1('Tim'.encode('utf-8'), usedforsecurity=False).hexdigest())
        sh.add_user_handler(test_user, 'Tom')
        sh.add_user_handler(test_user2, 'Tim')
        sh.add_molecule(test_user, 'c1ccn2nncc2c1',
                        '<cml xmlns=\"http://www.xml-cml.org/schema\"><molecule id=\"m1\"><atomArray><atom id=\"a1\" elementType=\"C\" x2=\"14.04999999999995\" y2=\"46.39999999999984\"/><atom id=\"a2\" elementType=\"C\" isotope=\"13\" x2=\"13.35999999999995\" y2=\"45.999999999999844\"/><atom id=\"a5\" elementType=\"C\" x2=\"14.739999999999949\" y2=\"45.19999999999985\"/><atom id=\"a6\" elementType=\"C\" x2=\"14.739999999999949\" y2=\"45.999999999999844\"/><atom id=\"a7\" elementType=\"R\" x2=\"15.43999999999995\" y2=\"46.39999999999984\"/></atomArray><bondArray><bond id=\"b1\" order=\"S\" atomRefs2=\"a1 a2\"/><bond id=\"b5\" order=\"S\" atomRefs2=\"a5 a6\"/><bond id=\"b6\" order=\"D\" atomRefs2=\"a6 a1\"/><bond id=\"b7\" order=\"S\" atomRefs2=\"a6 a7\"/></bondArray></molecule></cml>',
                        'MySuperCoolMolecule')
        sh.add_molecule(test_user2, 'c1ccn2nncc2c1',
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
                'units': 128,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 512,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 32,
                'activation': 'relu',
            },
        ], 'lossFunction': 'Huber Loss', 'optimizer': 'Nadam'}, '1')
        model_id2 = sh.add_model(test_user2, 'MyCoolModel2', {'layers': [
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
        ], 'lossFunction': 'Huber Loss', 'optimizer': 'Stochastic Gradient Descent'}, '1')
        ml.train(test_user, '2', model_id, ['lumo', 'homo'], 7, 64)
        model_id_2 = sh.add_model(test_user, 'MyCoolSecondModel',
                                  {'lossFunction': 'Mean Squared Error', 'optimizer': 'Adam', 'embeddingDimension': 128,
                                   'readoutSize': 1,
                                   'depth': 2}, '2')
        print(test_user)
    sio.run(app, allow_unsafe_werkzeug=True)  # add parameters here to change ip address


if __name__ == '__main__':
    run()
