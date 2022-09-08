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
        assert response.status_code == 200, 'Request should have worked'
        assert response.is_json, 'Response should be a json, just containing the model_id'
        assert response.json == model_id, 'Response should be the expected model_id'
