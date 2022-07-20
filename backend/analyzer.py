import json
import pickle
import numpy as np
import tensorflow as tf

from backend.storage_handler import StorageHandler as sh
from backend.storage_handler import UserDataStorageHandler as udsh


class Analyzer:

    def analyze(self, user_id, fitting_id, molecule_id):
        user_data_storage_handler_id = sh.__get_user_handler(sh, user_id)
        #user_data_storage_handler_id
        fitting = udsh.get_fitting(udsh, fitting_id)
        #get_fitting(user
