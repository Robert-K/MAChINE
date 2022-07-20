from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, Api, Resource

from backend import analyzer as an
from backend import storage_handler as sh
from backend import trainer as tr

app = Flask(__name__)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('task')
parser.add_argument('datasetID')
parser.add_argument('modelID')
parser.add_argument('fingerprint')
parser.add_argument('label')
parser.add_argument('moleculeID')
parser.add_argument('fittingID')



# modelList
# shows a list of all models, and lets you POST to add new tasks
class Models(Resource):
    def get(self, user_id):
        return sh.get_models(user_id)

    def patch(self, user_id):
        pass  # TODO: implement


class Molecules(Resource):
    def get(self, user_id):
        return sh.get_molecules(user_id)

    def patch(self, user_id):
        pass  # TODO: implement


class Fittings(Resource):
    def get(self, user_id):
        return sh.get_fittings(user_id)


class Users(Resource):
    def post(self, user_id):
        return sh.get_or_add_user(user_id)

    def delete(self, user_id):
        return sh.delete_user(user_id)


class Datasets(Resource):
    def get(self):
        return sh.get_datasets_info()


class BaseModels(Resource):
    def get(self):
        return sh.get_base_models


class Analyze(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        return an.analyze(user_id, args['fittingID'], args['moleculeID'])


class Train(Resource):
    def post(self, user_id):
        args = parser.parse_args()
        return tr.train(user_id, args['datasetID'], args['modelID'], args['fingerprint'], args['label'])


# Actually set up the Api resource routing here
api.add_resource(Users, '/users/<user_id>')
api.add_resource(Models, '/users/<user_id>/models')
api.add_resource(Molecules, '/users/<user_id>/molecules')
api.add_resource(Fittings, '/users/<user_id>/fittings')
# Training & Analyzing
api.add_resource(Analyze, '/users/<user_id>/analyze')
api.add_resource(Train, '/user/<user_id>/train')
# Non-user-specific resources
api.add_resource(Datasets, '/datasets')
api.add_resource(BaseModels, '/baseModels')


def run(debug=True):
    app.run()


if __name__ == '__main__':
    test_user = 'yee'
    sh.get_or_add_user(test_user)
    sh.add_molecule(test_user, 'aaah', {5: {'god_why': 'help', 'number': 42, 'true': False}})  # For testing purposes
    run()
