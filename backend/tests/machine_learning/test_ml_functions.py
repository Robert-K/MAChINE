import backend.machine_learning.ml_functions
import backend.machine_learning.ml_functions as ml
import pytest
import pytest_mock
import random
import tensorflow as tf
from tensorflow.python.framework import random_seed
import numpy

from backend.tests.mocks.mock_ml import MockTraining
from backend.tests.mocks.mock_models import TrainMockModel


@pytest.fixture(autouse=True)
def fix_seeds():
    random.seed = 42
    random_seed.set_seed(42)
    numpy.random.seed(42)


def test_training_start(mocker):
    mocker.patch('backend.machine_learning.ml_functions.is_training_running', return_value=False)
    mocker.patch('backend.machine_learning.ml_functions.Training')
    status = ml.train('', '', '', '', '', '')
    assert status, 'ml.train should have "succeeded"'


def test_training_start_running(mocker):
    mocker.patch('backend.machine_learning.ml_functions.is_training_running', return_value=True)
    mocker.patch('backend.machine_learning.ml_functions.Training')
    status = ml.train('', '', '', '', '', '')
    assert not status, 'ml.train should have "failed"'


@pytest.mark.parametrize(
    'user_id, smiles, fitting_id, model_id, base_model_id, labels, prediction',
    [
        ('345678afw', 'COOOOH', '-5212', '5125', '3', ['testLabel', 'testLabel2'], numpy.array([[0.075434], [45678]])),
    ]
)
def test_analyze(user_id, smiles, fitting_id, model_id, base_model_id, labels, prediction, mocker):
    mocker.patch('backend.utils.storage_handler.get_fitting', return_value=TrainMockModel(prediction))
    mocker.patch('backend.utils.storage_handler.get_fitting_summary',
                 return_value={'modelID': model_id, 'labels': labels})
    mocker.patch('backend.utils.storage_handler.get_model_summary', return_value={'baseModelID': base_model_id})
    mocker.patch('backend.utils.storage_handler.get_base_model', return_value={'type': 'random'})
    mocked_sh = mocker.patch('backend.utils.storage_handler.add_analysis')
    mocker.patch('backend.machine_learning.ml_functions.mld.molecule_conversion_functions', return_value={'test'})
    result = ml.analyze(user_id=user_id, fitting_id=fitting_id, smiles=smiles)

    formatted_analysis = dict()
    for (x, y) in zip(*[labels, prediction]):
        formatted_analysis |= {x: y}
    mocked_sh.assert_called_once_with(user_id, smiles, fitting_id, formatted_analysis)
    assert result == formatted_analysis, 'This should match. Every label to every value'


@pytest.mark.parametrize(
    'uid, content',
    [
        ('u', {}),
        ('blah', {'blah': MockTraining()}),
        ('u', {'blah': MockTraining()}),
    ]
)
class TestWithLiveTrainingsGroup:
    def test_is_training_running(self, uid, content):
        ml.live_trainings = content
        assert ml.is_training_running(uid) == bool(content), 'Expected training to be running when content not empty'

    def test_stop_training(self, uid, content, mocker):
        ml.live_trainings = dict(content)
        status = ml.stop_training(uid)
        assert status == bool(content.get(uid)), 'Yeah'


class TestLiveStatsGroup:
    @pytest.mark.parametrize(
        'user_id, epoch, logs',
        [
            ('myboi', 1, {}),
            ('-4567', 5, {'wee': 5.2512}),
            ('2527304', 12, {'metric': 5.5125}),
        ]
    )
    def test_on_epoch_end(self, user_id, epoch, logs, mocker):
        mocked_api = mocker.patch('backend.utils.api.update_training_logs')
        live_stats = ml.LiveStats(user_id)
        live_stats.on_epoch_end(epoch, dict(logs))
        logs |= {'epoch': epoch}
        mocked_api.assert_called_once_with(user_id, logs), 'api is supposed to be called with these parameters'
        assert live_stats.epochs_trained == epoch + 1, 'LiveStats is supposed to count epochs'

    @pytest.mark.parametrize(
        'user_id, epochs',
        [
            ('-15252521512512', 512),
            ('4567890', 1)
        ]
    )
    def test_on_train_begin(self, user_id, epochs, mocker):
        mocked_api = mocker.patch('backend.utils.api.notify_training_start')
        live_stats = ml.LiveStats(user_id)
        ml.live_trainings = {user_id: MockTraining(user_id=user_id, epochs=epochs)}
        live_stats.on_train_begin()
        mocked_api.assert_called_once_with(user_id, epochs), 'api is to be called once to confirm training start'

    @pytest.mark.parametrize(
        'user_id, dataset_id, model_id, batch_size, labels, model, initial_epoch, fitting_id, epochs, accuracy, epochs_trained',
        [
            ('112515', 'testID', '34567890', 256, ['labelA'], TrainMockModel({'content'}), 0, '-6543', 5, 0.05, 5),
        ]
    )
    def test_on_train_end_add(self, user_id, dataset_id, model_id, batch_size, labels, model,
                              initial_epoch, fitting_id, epochs, accuracy, epochs_trained,
                              mocker):
        live_stats = ml.LiveStats(user_id)
        live_stats.epochs_trained = epochs_trained
        live_stats.model = model
        ml.live_trainings = {user_id: MockTraining(user_id,
                                                   dataset_id,
                                                   model_id,
                                                   batch_size,
                                                   labels,
                                                   model,
                                                   None,
                                                   initial_epoch,
                                                   None,
                                                   epochs,
                                                   accuracy)}
        mocker.patch('backend.utils.storage_handler.get_user_handler', return_value={'Not None'})
        mocked_api = mocker.patch('backend.utils.api.notify_training_done')
        mocked_sh = mocker.patch('backend.utils.storage_handler.add_fitting', return_value=fitting_id)
        live_stats.on_train_end()
        mocked_sh.assert_called_once_with(user_id,
                                          dataset_id,
                                          labels,
                                          epochs_trained,
                                          accuracy,
                                          batch_size,
                                          model_id,
                                          model)
        mocked_api.assert_called_once_with(user_id, fitting_id, epochs_trained)

    @pytest.mark.parametrize(
        'user_id, dataset_id, model_id, batch_size, labels, model, initial_epoch, fitting_id, epochs, accuracy, '
        'epochs_trained',
        [
            ('112515', 'testID', '34567890', 256, ['labelA'], TrainMockModel({'content'}), 0, '-6543', 5, 0.05, 5)
        ]
    )
    def test_on_train_end_update(self, user_id, dataset_id, model_id, batch_size, labels, model,
                                 initial_epoch, fitting_id, epochs, accuracy, epochs_trained,
                                 mocker):
        live_stats = ml.LiveStats(user_id)
        live_stats.epochs_trained = epochs_trained
        live_stats.model = model
        ml.live_trainings = {user_id: MockTraining(user_id,
                                                   dataset_id,
                                                   model_id,
                                                   batch_size,
                                                   labels,
                                                   model,
                                                   None,
                                                   initial_epoch,
                                                   fitting_id,
                                                   epochs,
                                                   accuracy)}
        mocker.patch('backend.utils.storage_handler.get_user_handler', return_value={'Not None'})
        mocked_api = mocker.patch('backend.utils.api.notify_training_done')
        mocked_sh = mocker.patch('backend.utils.storage_handler.update_fitting', return_value=fitting_id)
        live_stats.on_train_end()
        mocked_sh.assert_called_once_with(user_id, fitting_id, epochs_trained, accuracy, model)
        mocked_api.assert_called_once_with(user_id, fitting_id, epochs_trained)

@pytest.mark.parametrize(
    'user_id, dataset_id, model_id, labels, epochs, batch_size',
    [
        ('456789', '0', '4567890', ['labelA', 'labelB'], 5, 128),
    ]
)
class TestTrainingClassGroup:

    @pytest.fixture()
    def mock_init_sh(self, mocker):
        mocker.patch('backend.utils.storage_handler.get_model_summary')
        mocker.patch('backend.utils.storage_handler.get_base_model')

    @pytest.fixture()
    def mock_init_creation(self, mocker):
        mocker.patch('backend.machine_learning.ml_functions.Training.create_model_and_set',
                     return_value=[None, None])
        mocker.patch('backend.machine_learning.ml_functions.Training.split_dataset', return_value=[None, None, None])

    def test_training_init(self, user_id, dataset_id, model_id, labels, epochs, batch_size, mock_init_sh, mock_init_creation):
        test_training = ml.Training(user_id, dataset_id, model_id, labels, epochs, batch_size)

        assert test_training.user_id == user_id
        assert test_training.dataset_id == dataset_id
        assert test_training.model_id == model_id
        assert test_training.batch_size == batch_size
        assert test_training.labels == labels
        assert test_training.model is None
        assert test_training.training_set is None
        assert test_training.validation_set is None
        assert test_training.test_set is None
        assert test_training.epochs == epochs
        assert test_training.fitting_id is None
        assert test_training.initial_epoch == 0, 'Initial epoch is 0 when fitting_id is None'

    @pytest.mark.parametrize(
        'fitting_id, initial_epochs',
        [('-567', 6)]
    )
    def test_training_init_load(self, user_id, dataset_id, model_id, labels, epochs, batch_size, fitting_id, initial_epochs, mocker, mock_init_sh, mock_init_creation):
        mock_model = TrainMockModel()
        mocker.patch('backend.utils.storage_handler.get_fitting', return_value=mock_model)
        mocker.patch('backend.utils.storage_handler.get_fitting_summary', return_value={'epochs': initial_epochs})

        test_training = ml.Training(user_id, dataset_id, model_id, labels, epochs, batch_size, fitting_id)

        assert test_training.initial_epoch == initial_epochs, 'Initial epoch should not be different'
        assert test_training.epochs == epochs + initial_epochs, 'Training epochs should be epochs + initial_epochs'
        assert test_training.model == mock_model

    def test_split_dataset(self, user_id, dataset_id, model_id, labels, epochs, batch_size, mocker, mock_init_sh, size=100):
        dataset_data = []
        for x in range(size):
            dataset_data.append([x, 3 * x])
        set = tf.data.Dataset.from_tensor_slices(dataset_data)
        mocker.patch('backend.machine_learning.ml_functions.Training.create_model_and_set',
                     return_value=[None, set])
        test_training = ml.Training(user_id, dataset_id, model_id, labels, epochs, batch_size)
        assert test_training.training_set.cardinality().numpy() == 70, 'Dataset should have a 70-20-10 split'
        assert test_training.validation_set.cardinality().numpy() == 20, 'Dataset should have a 70-20-10 split'
        assert test_training.test_set.cardinality().numpy() == 10, 'Dataset should have a 70-20-10 split'

    @pytest.mark.parametrize(
        'accuracy',
        [
            5432,
            0.000000001,
        ]
    )
    def test_evaluate_model(self, user_id, dataset_id, model_id, labels, epochs, batch_size, accuracy, mocker, mock_init_sh):
        mocker.patch('backend.machine_learning.ml_functions.Training.create_model_and_set',
                     return_value=[TrainMockModel(metrics_names={'r_square'}, evaluation={accuracy}), None])
        mocker.patch('backend.machine_learning.ml_functions.Training.split_dataset', return_value=[None, None, None])
        test_training = ml.Training(user_id, dataset_id, model_id, labels, epochs, batch_size)
        evaluated_accuracy = test_training.evaluate_model()
        assert evaluated_accuracy == round(accuracy * 100, 3), 'Expected to get accuracy back (as a rounded percentage)'

    def test_training_stop(self, user_id, dataset_id, model_id, labels, epochs, batch_size, mocker, mock_init_sh):
        mock_model = TrainMockModel()
        mocker.patch('backend.machine_learning.ml_functions.Training.create_model_and_set',
                     return_value=[mock_model, None])
        mocker.patch('backend.machine_learning.ml_functions.Training.split_dataset', return_value=[None, None, None])
        test_training = ml.Training(user_id, dataset_id, model_id, labels, epochs, batch_size)
        return_value = test_training.stop_training()
        assert mock_model.stop_training, 'Expected stop_training to be True'
        assert return_value, 'Expected stopping to work'
