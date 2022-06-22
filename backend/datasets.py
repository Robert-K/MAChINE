#inspired by André

import pickle
import json


def getDataset(id):
    try:
        #this implies the assumption that all datasets are named data1.plk, data2.plk, ...
        data = pickle.load(open("data" + str(id) + ".pkl", "rb"))

    except FileNotFoundError:
        return
    data = [json.loads(x) for x in data]
    return data