from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app)

usersDict = {
    'user': 0,
    'user1': 1
}


def get_data_from_request(payload, key):
    data_dict = json.loads(payload)
    if data_dict is None:
        return
    data = data_dict.get(key)
    print(data)
    return data


@app.route('/users/<user>/greeting/', methods=['GET'])
def greeting_interaction(user):
    if usersDict.get(user):
        return 'y\'ellow ' + user
    else:
        return 'you don\'t exist'


@app.route('/users/<user>/score/', methods=['POST'])
def set_score_interaction(user):
    data = request.get_data().decode('UTF-8')
    print(data)
    score = get_data_from_request(data, 'score')

    if score and user:
        usersDict.update({user: score})

    if usersDict.get(user):
        return 'Done'

    return 'Error, invalid user'


@app.route('/users/<user>/score/', methods=['GET'])
def get_score_interaction(user):
    if usersDict.get(user):
        return str(usersDict[user])
    return 'Error, invalid user'


if __name__ == '__main__':
    app.run(debug=True)
