import backend.machine_learning.ml_functions
import backend.machine_learning.ml_functions as ml
import pytest
import pytest_mock
import random
from tensorflow.python.framework import random_seed
import numpy

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


class MockTraining:
    def stop_training(self):
        return True

    def evaluate_model(self):
        return 0


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

@pytest.mark.parametrize(
    'user_id',
    [
        ('myboi'),
        ('-3456789765435678'),
        (''),
    ]
)
class TestLiveStatsGroup:
    @pytest.fixture()
    def live_stats(self, user_id):
        return ml.LiveStats(user_id)

    @pytest.mark.parametrize(
        'epoch, logs',
        [
            (1, {}),
            (5, {'wee': 5.2512}),
            (12, {'metric': 5.5125}),
        ]
    )
    def test_on_epoch_end(self, user_id, epoch, logs, live_stats, mocker):
        mocked_api = mocker.patch('backend.utils.api.update_training_logs')
        live_stats.on_epoch_end(epoch, dict(logs))
        logs |= {'epoch': epoch}
        mocked_api.assert_called_once_with(user_id, logs), 'api is supposed to be called with these parameters'

    def test_on_train_begin(self, user_id, live_stats, mocker):
        mocked_api = mocker.patch('backend.utils.api.notify_training_start')
        ml.live_trainings = {user_id: {'epochs': 3456}}
        live_stats.on_train_begin()
        mocked_api.assert_called_once_with(user_id, 3456), 'api is supposed to be called once to confirm training start'
