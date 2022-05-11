from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app)


@app.route('/home/', methods=['GET', 'POST'])
@cross_origin()

def parse_request():
    payload = request.get_data().decode('UTF-8')
    dataDict = json.loads(payload)
    user = dataDict['user']
    print(user)
    # dataInDict = data.loads()
    return "y\'ellow " + user


if __name__ =='__main__':
    app.run(debug = True)