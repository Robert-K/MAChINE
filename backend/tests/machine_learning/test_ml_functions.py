import backend.machine_learning.ml_functions
import backend.machine_learning.ml_functions as ml
import pytest
import pytest_mock
import random
from tensorflow.python.framework import random_seed
import numpy

from backend.tests.mocks.mock_ml import MockTraining
from backend.tests.mocks.mock_models import BasicMockModel


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
            ('112515', 'testID', '34567890', 256, ['labelA'], BasicMockModel({'content'}), 0, '-6543', 5, 0.05, 5),
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
            ('112515', 'testID', '34567890', 256, ['labelA'], BasicMockModel({'content'}), 0, '-6543', 5, 0.05, 5)
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
