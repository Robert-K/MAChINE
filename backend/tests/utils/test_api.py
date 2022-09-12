import hashlib
import json

import backend.utils.api as api
import backend.tests.mocks.mock_sh
import pytest
import pytest_mock

_test_user_id = 'test_user'


@pytest.fixture(autouse=True)
def client():
    api.app.config['TESTING'] = True
    with api.app.test_client() as client:
        yield client


def test_check_response(client):
    response = client.get('/check')
    assert response.status_code == 200, 'Response should have Status code 200'


class TestModelRequestGroup:

    def test_model_get_response_format(self, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH())
        response = client.get(f'/users/{_test_user_id}/models')
        assert response.status_code == 200, 'Request should have worked'
        assert type(response.json) == list, 'Response json should be a list'
        assert len(response.json) == 0, 'Response list should be empty'

    @pytest.mark.parametrize(
        'sh_models, sh_fittings, expected_models_output',
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
             }, [{'id': 'test_model_id',
                  'name': 'test_model',
                  'baseModel': 'Test A',
                  'parameters': '',
                  'fittings': [
                      {'id': 'test_fitting_id',
                       'modelID': 'test_model_id',
                       'modelName': 'test_model',
                       'datasetID': 'dataset_id',
                       'labels': ['labels', 'labels2'],
                       'epochs': 5,
                       'batchSize': 212,
                       'accuracy': 1}
                  ]}
                 ])
        ]
    )
    def test_model_get_response(self, sh_models, sh_fittings, expected_models_output, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH(sh_models, sh_fittings))
        response = client.get(f'/users/{_test_user_id}/models')
        assert response.status_code == 200, 'Request should have worked'
        assert type(response.json) == list, 'Response json should be a list'
        assert response.json == expected_models_output, 'Format & content of response json should match expected value'

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
            ('Aaaah', 'COOOOOOOOOO', '<While not a valid cml code, it is still just string>')
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
        'sh_models, sh_fittings, expected_fittings_output',
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
             }, [
                 {'id': 'test_fitting_id',
                  'modelID': 'test_model_id',
                  'modelName': 'test_model',
                  'datasetID': 'dataset_id',
                  'labels': ['labels', 'labels2'],
                  'epochs': 5,
                  'batchSize': 212,
                  'accuracy': 1},
                 {'id': 'test_fitting_id2',
                  'modelID': 'test_model_id',
                  'modelName': 'test_model',
                  'datasetID': 'dataset_id',
                  'labels': ['label'],
                  'epochs': 524,
                  'batchSize': 212,
                  'accuracy': 0.0002},
             ]),
            ({}, {}, [])
        ]
    )
    def test_fitting_get_response(self, sh_models, sh_fittings, expected_fittings_output, client, mocker):
        mocker.patch('backend.utils.api.sh', backend.tests.mocks.mock_sh.MockSH(fittings=sh_fittings, models=sh_models))
        response = client.get(f'/users/{_test_user_id}/fittings')
        assert response.status_code == 200, 'Request should have succeeded'
        assert response.json == expected_fittings_output, 'Response json should match the expected output'


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
        'sh_datasets, expected_dataset_output',
        [
            ({}, []),
            ({'dataset_id': {'name': 'dataset_name',
                             'size': 12515,
                             'labelDescriptors': ['label', 'label2', 'label3'],
                             'datasetPath': 'X',
                             'image': None,
                             }},
             [{
                 'name': 'dataset_name',
                 'datasetID': 'dataset_id',
                 'size': 12515,
                 'labelDescriptors': ['label', 'label2', 'label3'],
                 'image': None,
             }])

        ]
    )
    def test_dataset_get_response_format(self, sh_datasets, expected_dataset_output, client, mocker):
        mocker.patch('backend.utils.api.sh.get_dataset_summaries', return_value=sh_datasets)
        response = client.get(f'/datasets')
        assert response.status_code == 200, 'Request should have succeeded'
        assert response.json == expected_dataset_output, 'Expected output to match'

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
    def test_analyze_post_response_format(self, client, mocker):
        pass


class TestTrainRequestGroup:
    def test_train_response_format(self, client, mocker):
        pass
