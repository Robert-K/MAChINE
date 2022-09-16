import hashlib
import json

import backend.utils.api as api
import backend.tests.mocks.mock_sh
import pytest
import pytest_mock

_test_user_id = 'test_user'


@pytest.fixture
def client():
    api.app.config['TESTING'] = True
    with api.app.test_client() as client:
        yield client


@pytest.fixture
def socket():
    socket = api.sio.test_client(api.app)
    assert socket.is_connected()
    return socket


class TestModelRequestGroup:

    def test_model_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH())
        response = client.get(f'/users/{_test_user_id}/models')
        assert response.status_code == 200, 'Request should have worked'
        assert type(response.json) == list, 'Response json should be a list'
        assert len(response.json) == 0, 'Response list should be empty'

    @pytest.mark.parametrize(
        'sh_models, sh_fittings',
        [
            ({
                 'test_model_id': {
                     'name': 'test_model',
                     'baseModelID': 'Test A',
                     'parameters': '',
                     'fittingIDs': ['test_fitting_id']
                 }
             }, {
                 'test_fitting_id': {
                     'datasetID': 'dataset_id',
                     'labels': ['labels', 'labels2'],
                     'epochs': 5,
                     'accuracy': 1,
                     'batchSize': 212,
                     'fittingPath': 'X',
                     'modelID': 'test_model_id',
                 }
             })
        ]
    )
    def test_model_get_response(self, sh_models, sh_fittings, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH(sh_models, sh_fittings))
        response = client.get(f'/users/{_test_user_id}/models')
        assert response.status_code == 200, 'Request should have worked'
        assert type(response.json) == list, 'Response json should be a list'
        response_json = response.json
        for model_id, model in sh_models.items():
            converted_fittings = list()
            for fitting_id, fitting in {fitting_id: sh_fittings[fitting_id] for fitting_id in
                                        model.get('fittingIDs', {})}.items():
                converted_fitting = dict()
                converted_fitting |= {'id': fitting_id}
                converted_fitting |= {'modelID': fitting['modelID']}
                converted_fitting |= {'modelName': model['name']}
                converted_fitting |= {'datasetID': fitting['datasetID']}
                converted_fitting |= {'labels': fitting['labels']}
                converted_fitting |= {'epochs': fitting['epochs']}
                converted_fitting |= {'batchSize': fitting['batchSize']}
                converted_fitting |= {'accuracy': fitting['accuracy']}
                converted_fittings.append(converted_fitting)
            assert len(converted_fittings) == len(model.get('fittingIDs', {})), 'Model should contain every fitting'
            converted_model = dict()
            converted_model |= {'id': model_id}
            converted_model |= {'name': model['name']}
            converted_model |= {'baseModel': model['baseModelID']}
            converted_model |= {'parameters': model['parameters']}
            converted_model |= {'fittings': converted_fittings}
            assert converted_model in response_json, 'Response json should contain every model formatted like this'

    @pytest.mark.parametrize(
        'model_name, parameters, base_model',
        [
            ('test_model', {'loss': 'Mean Absolute Error'}, 'Test A')
        ]
    )
    def test_model_patch(self, model_name, parameters, base_model, client, mocker):
        model_id = str(-3)
        mocker.patch('backend.utils.api.sh.add_model', return_value=model_id)
        response = client.patch(f'/users/{_test_user_id}/models',
                                json={'name': model_name, 'parameters': parameters, 'baseModel': base_model})
        assert response.status_code == 201, 'Request should have worked'
        assert response.is_json, 'Response should be a json, just containing the model_id'
        assert response.json == model_id, 'Response should be the expected model_id'


class TestMoleculeRequestGroup:
    def test_molecule_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh.get_molecules', return_value={})
        response = client.get(f'/users/{_test_user_id}/molecules')
        assert response.status_code == 200, 'Request should have worked'
        assert response.is_json, 'Response should be a json'
        assert type(response.json) == list, 'Response json should be a list'
        assert len(response.json) == 0, 'List should be empty'

    @pytest.mark.parametrize(
        'sh_molecules, sh_fitting_summary, sh_model_summary ,expected_molecules_output',
        [
            ({'c1ccn2nncc2c1': {'name': 'MyTestMolecule', 'cml': '<cml></cml>', 'analyses': {}}}, {}, {},
             [{'name': 'MyTestMolecule', 'smiles': 'c1ccn2nncc2c1', 'cml': '<cml></cml>', 'analyses': []}]),
            ({'COOOOOO': {'name': 'test_name', 'cml': '<cml code>', 'analyses': {'50252': {'lumo': -7.152523}}}},
             {'modelID': 'test_model_id'},
             {'name': 'test_model'},
             [{'name': 'test_name', 'smiles': 'COOOOOO', 'cml': '<cml code>',
               'analyses': [{'modelName': 'test_model', 'fittingID': '50252', 'results': {'lumo': -7.152523}}]}])
        ]
    )
    def test_molecule_get(self, sh_molecules, sh_fitting_summary, sh_model_summary, expected_molecules_output, client,
                          mocker):
        mocker.patch('backend.utils.api.sh.get_molecules', return_value=sh_molecules)
        mocker.patch('backend.utils.api.sh.get_fitting_summary', return_value=sh_fitting_summary)
        mocker.patch('backend.utils.api.sh.get_model_summary', return_value=sh_model_summary)
        response = client.get(f'/users/{_test_user_id}/molecules')
        assert response.status_code == 200, 'Request should have worked'
        assert type(response.json) == list, 'Response json should be a list'
        assert response.json == expected_molecules_output, 'Response json should be formatted like expected_output'

    @pytest.mark.parametrize(
        'test_mol_name, test_smiles, test_cml',
        [
            ('Aaaah', 'COOOOOOOOOO', '<While not a valid cml code, they\'re still just strings>')
        ]
    )
    def test_molecule_patch(self, test_mol_name, test_smiles, test_cml, client, mocker):
        mocker.patch('backend.utils.api.sh.add_molecule', return_value=None)
        response = client.patch(f'/users/{_test_user_id}/molecules',
                                json={'name': test_mol_name, 'smiles': test_smiles, 'cml': test_cml})
        assert response.status_code == 201, 'Request should have worked'
        assert response.json is None, 'Response json should be None'


class TestFittingRequestGroup:
    def test_fitting_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH())
        response = client.get(f'/users/{_test_user_id}/fittings')
        assert response.status_code == 200, 'Request should have succeeded'
        assert response.is_json, 'Response should be a json'
        assert type(response.json) is list, 'Response should be a list'
        assert len(response.json) == 0, 'List should be empty'

    @pytest.mark.parametrize(
        'sh_models, sh_fittings',
        [
            ({
                 'test_model_id': {
                     'name': 'test_model',
                     'baseModelID': 'Test A',
                     'parameters': '',
                     'fittingIDs': ['test_fitting_id']
                 }
             }, {
                 'test_fitting_id': {
                     'datasetID': 'dataset_id',
                     'labels': ['labels', 'labels2'],
                     'epochs': 5,
                     'accuracy': 1,
                     'batchSize': 212,
                     'fittingPath': 'X',
                     'modelID': 'test_model_id',
                 },
                 'test_fitting_id2': {
                     'datasetID': 'dataset_id',
                     'labels': ['label'],
                     'epochs': 524,
                     'accuracy': 0.000200,
                     'batchSize': 212,
                     'fittingPath': 'X2',
                     'modelID': 'test_model_id',
                 }
             }),
            ({}, {})
        ]
    )
    def test_fitting_get_response(self, sh_models, sh_fittings, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH(fittings=sh_fittings, models=sh_models))
        response = client.get(f'/users/{_test_user_id}/fittings')
        assert response.status_code == 200, 'Request should have succeeded'
        response_json = response.json
        for fitting_id, fitting in sh_fittings.items():
            model_name = 'n/a'
            model = sh_models.get(fitting.get('modelID'))
            if model:
                model_name = model.get('name')
            converted_fitting = dict()
            converted_fitting |= {'id': fitting_id}
            converted_fitting |= {'modelID': fitting['modelID']}
            converted_fitting |= {'modelName': model_name}
            converted_fitting |= {'datasetID': fitting['datasetID']}
            converted_fitting |= {'labels': fitting['labels']}
            converted_fitting |= {'epochs': fitting['epochs']}
            converted_fitting |= {'batchSize': fitting['batchSize']}
            converted_fitting |= {'accuracy': fitting['accuracy']}
            assert converted_fitting in response_json, 'Response should contain every fitting properly formatted'


class TestUserRequestGroup:

    @pytest.mark.parametrize(
        'test_username',
        [
            'Tom',
            'WADawd',
        ]
    )
    def test_add_user_response(self, test_username, client, mocker):
        mocker.patch('backend.utils.api.sh.add_user_handler', return_value={'This represents a handler'})
        response = client.post(f'/users', json={'username': test_username})
        user_id = str(hashlib.sha1(test_username.encode('utf-8'), usedforsecurity=False).hexdigest())
        assert response.status_code == 201, 'Request should have worked'
        assert response.is_json, 'Response should be a json'
        assert response.json == {'userID': user_id}, 'json should contain the user id'

    def test_add_user_error(self, client, mocker):
        mocker.patch('backend.utils.api.sh.add_user_handler', return_value=None)
        response = client.post(f'/users', json={'username': 'test'})
        assert response.status_code == 404, 'User shouldn\'t have been created'

    def test_delete_user_response(self, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockUserDelSH())
        response = client.delete(f'/users/{_test_user_id}')
        assert response.status_code == 200, 'Request should have worked'
        assert response.json is None, 'Response should have a json'

    def test_delete_user_internal_error_response(self, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockUserDelSH(delete_handler=False))
        response = client.delete(f'/users/{_test_user_id}')
        assert response.status_code == 500, 'Expected to respond with internal server error'
        assert response.json is None, 'Response should have a json'

    def test_delete_non_user_error_response(self, client, mocker):
        mocker.patch('backend.utils.api.sh.get_user_handler', return_value=None)
        response = client.delete(f'/users/{_test_user_id}')
        assert response.status_code == 404, 'Expected to respond with "not found"'
        assert response.json is None, 'Response should have a json'


class TestDatasetRequestGroup:
    def test_dataset_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh.get_dataset_summaries', return_value={})
        response = client.get(f'/datasets')
        assert response.status_code == 200, 'Request should have succeeded'
        assert response.is_json, 'Response should be a json'
        assert type(response.json) == list, 'Response JSON should be a list'
        assert len(response.json) == 0, 'List should be empty'

    @pytest.mark.parametrize(
        'sh_datasets',
        [
            ({}),
            ({'dataset_id': {'name': 'dataset_name',
                             'size': 12515,
                             'labelDescriptors': ['label', 'label2', 'label3'],
                             'datasetPath': 'X',
                             'image': None,
                             }})
        ]
    )
    def test_dataset_get_response(self, sh_datasets, client, mocker):
        mocker.patch('backend.utils.api.sh.get_dataset_summaries', return_value=sh_datasets)
        response = client.get(f'/datasets')
        response_json = response.json
        assert response.status_code == 200, 'Request should have succeeded'
        for dataset_id, dataset in sh_datasets.items():
            converted_set = dict()
            converted_set |= {'name': dataset.get('name')}
            converted_set |= {'datasetID': dataset_id}
            converted_set |= {'size': dataset.get('size')}
            converted_set |= {'labelDescriptors': dataset.get('labelDescriptors')}
            converted_set |= {'image': dataset.get('image')}
            assert converted_set in response_json, 'Dataset to be in Response'


class TestBaseModelRequestGroup:
    def test_base_model_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh.get_base_models', return_value={})
        response = client.get(f'/baseModels')
        assert response.status_code == 200, 'Request should have succeeded'
        assert response.is_json, 'Response should be a json list'
        assert type(response.json) == list, 'Response should be a list'
        assert len(response.json) == 0, 'Response should be an empty list'

    # TODO: Rewrite when ModelVis is merged
    @pytest.mark.parametrize(
        'sh_base_models',
        [
            ({"id2": {
                "name": "Test Schnet",
                "type": "schnet",
                "lossFunction": "Mean Squared Error",
                "optimizer": "NAdam",
                "metrics": [
                    "MeanAbsoluteError",
                    "R2"
                ],
                "image": "None"
            }}),
            ({
                "test id": {
                    "name": "Test A",
                    "type": "sequential",
                    "lossFunction": "Mean Squared Error",
                    "optimizer": "Adam",
                    "metrics": [
                        "MeanAbsoluteError",
                        "R2"
                    ],
                    "layers": [
                        {
                            "type": "Dense",
                            "units": 5,
                            "activation": "relu"
                        },
                    ],
                    "image": "X"
                },
                "id2": {
                    "name": "Test Schnet",
                    "type": "schnet",
                    "lossFunction": "Mean Squared Error",
                    "optimizer": "NAdam",
                    "metrics": [
                        "MeanAbsoluteError",
                        "R2"
                    ],
                    "image": "None"
                }
            }),
        ]
    )
    def test_base_model_get_response(self, sh_base_models, client, mocker):
        mocker.patch('backend.utils.api.sh.get_base_models', return_value=sh_base_models)
        response = client.get(f'/baseModels')
        for model_id, model in sh_base_models.items():
            layers = model.get('layers')
            if model and layers:
                comparative_model = dict()
                comparative_model |= {'name': model.get('name')}
                comparative_model |= {'id': model_id}
                comparative_model |= {'type': {'name': model.get('type'), 'image': model.get('image')}}
                comparative_model |= {
                    'taskType': ('regression' if layers[len(layers) - 1].get('units') == 1 else 'classification')}
                comparative_model |= {'lossFunction': model.get('lossFunction')}
                comparative_model |= {'lossFunction': model.get('lossFunction')}
                comparative_model |= {'optimizer': model.get('optimizer')}
                comparative_model |= {'layers': model.get('layers')}
                response_list = response.json
                assert comparative_model in response_list, 'Basemodel in SH should bee in response, formatted like this'


class TestAnalyzeRequestGroup:
    @pytest.mark.parametrize(
        'test_analysis',
        [
            {'test': -5125.2},
            {'awdawd': 25170.12124},
            {}
        ]
    )
    def test_analyze_post_response(self, test_analysis, client, mocker):
        mocker.patch('backend.utils.api.ml.analyze', return_value=test_analysis)
        response = client.post(f'/users/{_test_user_id}/analyze', json={})
        assert response.status_code == 200, 'Response should have worked'
        assert response.is_json, 'Response should be a json'
        assert response.json == test_analysis, 'Response json should match analysis'


# TODO: Implement
class TestTrainRequestGroup:
    @pytest.mark.parametrize(
        '',
        [
            ()
        ]
    )
    def test_train_post_response(self, client, mocker):
        pass

    def test_train_busy_post_response(self, client, mocker):
        pass

    def test_train_patch_response(self, client, mocker):
        pass

    def test_train_busy_patch_response(self, client, mocker):
        pass

    def test_train_fail_patch_response(self, client, mocker):
        pass

    def test_train_delete_response(self, client, mocker):
        pass

    def test_train_fail_delete_response(self, client, mocker):
        pass