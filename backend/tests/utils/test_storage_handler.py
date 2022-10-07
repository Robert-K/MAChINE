from pathlib import Path

import pytest
import copy
import backend.utils.storage_handler as sh
import backend.tests.mocks.mock_models as mm

_test_user_id = 'Wakawaka'
_test_user_name = "aaah"


@pytest.fixture(autouse=True)
def delete_user_handler():
    sh.add_user_handler(_test_user_id, _test_user_name)
    sh.delete_user_handler(_test_user_id)


@pytest.fixture
def mock_deletion(mocker):
    mocker.patch('backend.utils.storage_handler.UserDataStorageHandler.clean_files', return_value=None)


def test_handler_creation():
    handler = sh.add_user_handler(_test_user_id, _test_user_name)
    assert sh.get_user_handler(_test_user_id) == handler, 'Expected just created handler'
    sh.delete_user_handler(_test_user_id)
    new_handler = sh.add_user_handler(_test_user_id, _test_user_name)
    assert sh.get_user_handler(_test_user_id) != handler, 'Expected new_handler'
    assert sh.get_user_handler(_test_user_id) == new_handler, 'Expected just created new_handler'


def test_handler_double_creation():
    handler = sh.add_user_handler(_test_user_id, _test_user_name)
    other_handler = sh.add_user_handler(_test_user_id, _test_user_name)
    assert handler != other_handler


def test_handler_deletion():
    handler = sh.add_user_handler(_test_user_id, _test_user_name)
    sh.delete_user_handler(_test_user_id)
    assert sh.get_user_handler(_test_user_id) is None
    assert not handler.user_path.exists()


@pytest.mark.parametrize(
    'test_smiles,test_cml,test_name',
    [
        ('test_smiles', '<test_cml>', 'test_name'),
        ('john', 'cena', 'my_boi'),
    ],
)
class TestBasicMoleculeGroup:

    def test_molecule_addition(self, test_smiles, test_cml, test_name):
        sh.add_user_handler(_test_user_id, _test_user_name)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        assert len(sh.get_molecules(_test_user_id)) == 1
        assert molecule is not None, 'Expected UserSH to contain this molecule'
        assert molecule == {'name': test_name, 'cml': test_cml, 'analyses': dict()}

    def test_molecule_loading(self, test_smiles, test_cml, test_name, *mock_deletion):
        handler = sh.add_user_handler(_test_user_id, _test_user_name)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        new_handler = sh.add_user_handler(_test_user_id, _test_user_name)
        assert new_handler != handler, 'New Handler should be different'
        loaded_molecules = sh.get_molecules(_test_user_id)
        loaded_molecule = loaded_molecules.get(test_smiles)
        assert loaded_molecules == molecules, 'Loaded molecules should be the exact same'
        assert loaded_molecule == molecule, 'Loaded molecule should be the same'

    def test_analysis_addition(self, test_smiles, test_cml, test_name):
        test_fitting_id = 'test_fitting'
        test_fitting_id2 = 'test_fitting_b'
        test_results = {'test': 5}
        test_results2 = {5: 'aa'}
        sh.add_user_handler(_test_user_id, _test_user_name)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        sh.add_analysis(_test_user_id, test_smiles, test_fitting_id, test_results)
        sh.add_analysis(_test_user_id, test_smiles, test_fitting_id2, test_results2)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        assert len(molecules) == 1, 'User molecules should only contain just added molecule'
        assert molecule == {'name': test_name, 'cml': test_cml,
                            'analyses': {test_fitting_id: test_results,
                                         test_fitting_id2: test_results2}}, 'Molecule should have the same analyses ' \
                                                                            'as just added '


@pytest.mark.parametrize(
    'test_model_name, test_parameters, test_base_id',
    [
        ('Name', {'layers': [
            {
                'type': 'dense',
                'units': 25,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 125,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 256,
                'activation': 'relu',
            },
            {
                'type': 'dense',
                'units': 22,
                'activation': 'relu',
            },
        ], 'loss': 'MeanSquaredError', 'optimizer': 'Adam'}, 'Test A'),
        ('Name2', {'layers': [], 'loss': '', 'optimizer': ''}, 'Test A'),
        ('Name B', {'embeddingDim': 256, 'depth': 3, 'readoutSize': 2, 'loss': 'MeanSquaredError', 'optimizer': 'Adam'},
         'Test B'),
        ('', {}, '')
    ],
)
class TestBasicModelGroup:
    def test_model_addition(self, test_model_name, test_parameters, test_base_id):
        sh.add_user_handler(_test_user_id, _test_user_name)
        assert len(sh.get_model_summaries(_test_user_id)) == 0
        test_model_id = sh.add_model(_test_user_id, test_model_name, test_parameters, test_base_id)
        summary = sh.get_model_summary(_test_user_id, test_model_id)
        assert len(sh.get_model_summaries(_test_user_id)) == 1
        assert summary.get('name') == test_model_name, 'Name should not be modified'
        assert summary.get('baseModelID') == test_base_id, 'Base-model ID should not be modified'
        assert summary.get('parameters') == test_parameters, 'Parameters should not be modified'
        assert summary.get('fittingIDs') == [], 'Fitting ID Array should be empty'

    def test_model_loading(self, test_model_name, test_parameters, test_base_id, mock_deletion):
        test_fitting_id = str(5125)
        handler = sh.add_user_handler(_test_user_id, _test_user_name)
        model_id = sh.add_model(_test_user_id, test_model_name, test_parameters, test_base_id)
        models = sh.get_model_summaries(_test_user_id)
        model = sh.get_model_summary(_test_user_id, model_id)
        sh.get_user_handler(_test_user_id).add_fitting_to_model(model_id, test_fitting_id)
        new_handler = sh.add_user_handler(_test_user_id, _test_user_name)
        assert new_handler != handler, 'New Handler should be different'
        loaded_models = sh.get_model_summaries(_test_user_id)
        loaded_model = sh.get_model_summary(_test_user_id, model_id)
        assert loaded_model is not None, 'Model should be loadable with same ID'
        assert loaded_models == models, 'Loaded models should be the exact same'
        assert loaded_model == model, 'Loaded model should be the same'


@pytest.mark.parametrize(
    'test_dataset_id, test_labels, test_epochs, test_accuracy, test_batch_size, test_fitting',
    [
        ('0', ['testy_boi'], 500, 5, 1285, mm.BasicMockModel('content and more'))
    ],
)
class TestBasicFittingsGroup:

    @pytest.fixture
    def add_test_model(self):
        test_model_name = 'test_model'
        test_parameters = {'embeddingDim': 256, 'depth': 3, 'readoutSize': 2, 'loss': 'MeanSquaredError',
                           'optimizer': 'Adam'}
        test_basemodel_id = 'Test B'
        sh.add_user_handler(_test_user_id, _test_user_name)
        added_model_id = sh.add_model(_test_user_id, test_model_name, test_parameters, test_basemodel_id)
        return added_model_id

    @pytest.fixture
    def mock_keras_save(self, mocker):
        mocker.patch('tensorflow.keras.models.load_model', mm.load_model)

    def test_fitting_addition(self, test_dataset_id, test_labels, test_epochs, test_accuracy, test_batch_size,
                              test_fitting,
                              add_test_model, mock_keras_save):
        assert add_test_model is not None, 'Test setup'
        assert sh.get_model_summary(_test_user_id, add_test_model) != {}, 'Test setup'
        assert len(sh.get_model_summaries(_test_user_id)) == 1, 'Test setup'
        assert len(sh.get_fitting_summaries(_test_user_id)) == 0, 'Default state'
        test_fitting_id = sh.add_fitting(_test_user_id, test_dataset_id, test_labels, test_epochs, test_accuracy,
                                         test_batch_size, add_test_model, test_fitting)
        assert len(sh.get_fitting_summaries(_test_user_id)) == 1, 'Fitting summary should exist'
        assert test_fitting_id is not None, 'Should have a fitting ID'
        fitting_summary = sh.get_fitting_summary(_test_user_id, test_fitting_id)
        assert fitting_summary.get('datasetID') == test_dataset_id, 'DatasetID should not be modified in call'
        assert fitting_summary.get('labels') == test_labels, 'labels should not be modified in call'
        assert fitting_summary.get('epochs') == test_epochs, 'epochs should not be modified in call'
        assert fitting_summary.get('accuracy') == test_accuracy, 'accuracy should not be modified in call'
        assert fitting_summary.get('batchSize') == test_batch_size, 'batch_size should not be modified in call'
        assert fitting_summary.get('fittingPath') is not None, 'fittingPath should exist'
        assert fitting_summary.get('modelID') == add_test_model, 'modelID should be the same'
        assert sh.get_model_summary(_test_user_id, add_test_model).get('fittingIDs') == [
            test_fitting_id], 'Model should contain ' \
                              'this one fitting '
        assert (Path(sh.get_user_handler(
            _test_user_id).user_fittings_path) / f'{test_fitting_id}_fitting').exists(), 'Fitting should get saved '
        loaded_fitting = sh.get_fitting(_test_user_id, test_fitting_id)
        assert type(loaded_fitting) == type(test_fitting), 'fitting should get loaded'

        scoreboard_entry = sh.get_scoreboard_summaries().get(test_fitting_id)
        wanted_entry = {'id': test_fitting_id,
                        'userName': str(sh.get_user_handler(_test_user_id).username),
                        'modelID': add_test_model,
                        'modelName': sh.get_user_handler(_test_user_id).get_model_summary(
                            add_test_model).get(
                            'name'),
                        'datasetID': test_dataset_id,
                        'labels': test_labels,
                        'epochs': test_epochs,
                        'batchSize': test_batch_size,
                        'accuracy': test_accuracy}
        assert wanted_entry == scoreboard_entry, 'Scoreboard entry should look like this'

    def test_fitting_loading(self, test_dataset_id, test_labels, test_epochs, test_accuracy, test_batch_size,
                             test_fitting, add_test_model, mock_keras_save, mock_deletion):
        assert add_test_model is not None, 'Test setup'
        assert sh.get_model_summary(_test_user_id, add_test_model) != {}, 'Test setup'
        assert len(sh.get_model_summaries(_test_user_id)) == 1, 'Test setup'
        test_fitting_id = sh.add_fitting(_test_user_id, test_dataset_id, test_labels, test_epochs, test_accuracy,
                                         test_batch_size, add_test_model, test_fitting)
        fitting_summaries = sh.get_fitting_summaries(_test_user_id)
        fitting_summary = sh.get_fitting_summary(_test_user_id, test_fitting_id)
        fitting = sh.get_fitting(_test_user_id, test_fitting_id)
        user_path = sh.get_user_handler(_test_user_id).user_path
        sh.delete_user_handler(_test_user_id)
        assert user_path.exists(), 'Test setup. NEEDS to exist after "deletion"'
        sh.add_user_handler(_test_user_id, _test_user_name)
        assert type(sh.get_fitting(_test_user_id, test_fitting_id)) == type(fitting), 'Fittings should be same of type'
        assert sh.get_fitting_summary(_test_user_id, test_fitting_id) == fitting_summary, 'Loaded fitting summary ' \
                                                                                          'dict should be the exact ' \
                                                                                          'same '
        assert sh.get_fitting_summaries(_test_user_id) == fitting_summaries, 'Loaded fitting summaries dict should ' \
                                                                             'bee the exact same '

    def test_broken_fitting(self, test_dataset_id, test_labels, test_epochs, test_accuracy, test_batch_size,
                            test_fitting, add_test_model, mock_keras_save):
        assert add_test_model is not None, 'Test setup'
        assert sh.get_model_summary(_test_user_id, add_test_model) != {}, 'Test setup'
        assert len(sh.get_model_summaries(_test_user_id)) == 1, 'Test setup'
        test_fitting = mm.BrokenMockModel('broke')
        fitting_id = sh.add_fitting(_test_user_id, test_dataset_id, test_labels, test_epochs, test_accuracy,
                                    test_batch_size, add_test_model, test_fitting)
        assert fitting_id is None, 'Unsaved model cannot have an ID'
        assert len(sh.get_fitting_summaries(_test_user_id)) == 0, 'Fitting summary not be saved'
        assert sh.get_fitting_summary(_test_user_id, fitting_id) is None, 'Fitting summary not be saved'
        assert sh.get_fitting(_test_user_id, fitting_id) is None, 'Fitting should not be saved'


@pytest.mark.parametrize(
    'sh_fittings, sh_scoreboard, fitting_id, epochs, accuracy, fitting',
    [
        ({'aah': {'datasetID': 'testID', 'epochs': 142, 'accuracy': 12}}, {'aah': {'epochs': 142, 'accuracy': 12}},
         'aah', 12, 0.01, mm.BasicMockModel({'hi'})),
    ]
)
def test_fitting_update(sh_fittings, sh_scoreboard, fitting_id, epochs, accuracy, fitting):
    sh.add_user_handler(_test_user_id, _test_user_name)
    sh.get_user_handler(_test_user_id).fitting_summaries = sh_fittings
    sh._inst.scoreboard_summaries = sh_scoreboard
    result_id = sh.update_fitting(_test_user_id, fitting_id, epochs, accuracy, fitting)
    assert result_id == fitting_id, 'Expect returned fitting_id to be equal'
    summary = sh.get_fitting_summary(_test_user_id, fitting_id)
    scoreboard = sh.get_scoreboard_summaries().get(fitting_id)
    assert summary.get('epochs') == epochs, 'Expected values to be updated'
    assert summary.get('accuracy') == accuracy, 'Expected values to be updated'
    assert scoreboard.get('epochs') == epochs, 'Expected values to be updated'
    assert scoreboard.get('accuracy') == accuracy, 'Expected values to be updated'


@pytest.mark.parametrize(
    'sh_fittings, fitting_id, epochs, accuracy, fitting',
    [
        ({}, 'aah', 12, 0.01, mm.BrokenMockModel({'hi'})),
        ({}, 'aah', 12, 0.01, mm.BasicMockModel({'hi'})),
        ({'aah': {'datasetID': 'testID', 'epochs': 142, 'accuracy': 12}}, 'aah', 12, 0.01, mm.BrokenMockModel({'hi'}))
    ]
)
def test_fitting_update_failure(sh_fittings, fitting_id, epochs, accuracy, fitting):
    sh.add_user_handler(_test_user_id, _test_user_name)
    sh.get_user_handler(_test_user_id).fitting_summaries = sh_fittings
    assert sh.update_fitting(_test_user_id, fitting_id, epochs, accuracy, fitting) is None, 'Expected None when fails'
    assert sh.get_fitting_summary(_test_user_id, fitting_id) is None, 'Expected fitting to not exist when fails'


def test_dataset_reading():
    # This is hardcoded for Testset Solubility
    summaries = sh.get_dataset_summaries()
    assert len(summaries) == 1
    set_summary = summaries.get('0')
    dataset = sh.get_dataset('0')
    assert len(dataset) == set_summary.get('size')
    assert set_summary.get('name') == 'Test Solubility Set'
    assert set_summary.get('labelDescriptors') == ['Solubility']


def test_base_model_reading():
    summaries = sh.get_base_models()
    base_a = sh.get_base_model('testA')
    base_b = sh.get_base_model('testB')
    assert len(summaries) == 2
    assert set(summaries.keys()) == {'testA', 'testB'}
    assert base_a.get('type') == 'sequential'
    assert base_b.get('type') == 'schnet'
    # We will now assume that it read everything else correctly


@pytest.mark.parametrize(
    'saved_boards',
    [
        ({'id1': {'id': 'id1'}, 'id2': {'id': 'another entry'}}),
        ({})
    ]
)
class TestScoreboardGroup:
    @pytest.mark.parametrize(
        'delete_id',
        [
            'id1',
            'id2',
            'id3'
        ]
    )
    def test_delete_scoreboard(self, saved_boards, delete_id):
        sh._inst.scoreboard_summaries = copy.deepcopy(saved_boards)
        sh.delete_scoreboard_fitting(delete_id)
        assert sh.get_scoreboard_summaries().get(delete_id) is None, 'Expected entry to have been deleted'

    def test_delete_scoreboards(self, saved_boards):
        sh._inst.scoreboard_summaries = copy.deepcopy(saved_boards)
        sh.delete_scoreboard_fittings()
        assert sh.get_scoreboard_summaries() == dict(), 'Expected scoreboard to have been cleared'


@pytest.mark.parametrize(
    'sh_datasets_histograms, dataset_id, labels',
    [
        ({'1': {'histograms': {'lumo': {'bin_edges': [1, 2, 3, 4, 5, 2], 'buckets': [4, 2, 3, 5, 4]}}}}, '1', ['lumo']),
    ]
)
def test_get_dataset_histograms(sh_datasets_histograms, dataset_id, labels):
    sh._inst.dataset_summaries = sh_datasets_histograms
    histograms = sh.get_dataset_histograms(dataset_id, labels)

    for label in labels:
        if sh_datasets_histograms.get(dataset_id):
            assert sh_datasets_histograms.get(dataset_id).get('histograms').get(label) == histograms.get(label)

