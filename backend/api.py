from flask import Flask
from flask_cors import CORS
from flask_restful import reqparse, abort, Api, Resource

app = Flask(__name__)
CORS(app)
api = Api(app)

models = {
    'model1': {'description': 'build an API'},
    'model2': {'description': '?????'},
    'model3': {'description': 'profit!'},
}


def abort_if_model_doesnt_exist(model_id):
    if model_id not in models:
        abort(404, message="model {} doesn't exist".format(model_id))


parser = reqparse.RequestParser()
parser.add_argument('task')


# model
# shows a single model item and lets you delete a model item
class Model(Resource):
    def get(self, model_id):
        abort_if_model_doesnt_exist(model_id)
        return models[model_id]

    def delete(self, model_id):
        abort_if_model_doesnt_exist(model_id)
        del models[model_id]
        return '', 204

    def put(self, model_id):
        args = parser.parse_args()
        task = {'task': args['task']}
        models[model_id] = task
        return task, 201


# modelList
# shows a list of all models, and lets you POST to add new tasks
class ModelList(Resource):
    def get(self):
        return models

    def post(self):
        args = parser.parse_args()
        model_id = int(max(models.keys()).lstrip('model')) + 1
        model_id = 'model%i' % model_id
        models[model_id] = {'task': args['task']}
        return models[model_id], 201


##
## Actually setup the Api resource routing here
##
api.add_resource(ModelList, '/models')
api.add_resource(Model, '/models/<model_id>')


def run(debug=True):
    app.run(debug)


if __name__ == '__main__':
    run()
