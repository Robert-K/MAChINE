import pytest

import backend.utils.storage_handler as sh

_test_user_id = 'Wakawaka'


@pytest.fixture(autouse=True)
def delete_user_handler():
    sh.delete_user_handler(_test_user_id)


def test_handler_creation():
    handler = sh.add_user_handler(_test_user_id)
    assert sh.get_user_handler(_test_user_id) == handler, 'Expected just created handler'
    sh.delete_user_handler(_test_user_id)
    new_handler = sh.add_user_handler(_test_user_id)
    assert sh.get_user_handler(_test_user_id) != handler, 'Expected new_handler'
    assert sh.get_user_handler(_test_user_id) == new_handler, 'Expected just created new_handler'


def test_handler_double_creation():
    handler = sh.add_user_handler(_test_user_id)
    other_handler = sh.add_user_handler(_test_user_id)
    assert handler != other_handler


def test_handler_deletion():
    handler = sh.add_user_handler(_test_user_id)
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
        sh.add_user_handler(_test_user_id)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        assert len(sh.get_molecules(_test_user_id)) == 1
        assert molecule is not None, 'Expected UserSH to contain this molecule'
        assert molecule == {'name': test_name, 'cml': test_cml, 'analyses': dict()}

    def test_molecule_loading(self, mocker, test_smiles, test_cml, test_name):
        mocker.patch('backend.utils.storage_handler.UserDataStorageHandler.clean_files', return_value=None)
        handler = sh.add_user_handler(_test_user_id)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        new_handler = sh.add_user_handler(_test_user_id)
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
        sh.add_user_handler(_test_user_id)
        sh.add_molecule(_test_user_id, test_smiles, test_cml, test_name)
        sh.add_analysis(_test_user_id, test_smiles, test_fitting_id, test_results)
        sh.add_analysis(_test_user_id, test_smiles, test_fitting_id2, test_results2)
        molecules = sh.get_molecules(_test_user_id)
        molecule = molecules.get(test_smiles)
        assert len(molecules) == 1
        assert molecule == {'name': test_name, 'cml': test_cml,
                            'analyses': {test_fitting_id: test_results, test_fitting_id2: test_results2}}

class TestBasicModelGroup:
    def test_model_addition(self):
        pass


def test_dataset_reading():
    # This is hardcoded for Testset Solubility
    summaries = sh.get_dataset_summaries()
    assert len(summaries) == 1
    set_summary = summaries.get('0')
    dataset = sh.get_dataset('0')
    assert len(dataset) == set_summary.get('size')
    assert set_summary.get('name') == 'Test Solubility Set'
    assert set_summary.get('labelDescriptors') == ['Solubility']
    assert set_summary.get('imageFile') is None


def test_base_model_reading():
    summaries = sh.get_base_models()
    base_a = sh.get_base_model('testA')
    base_b = sh.get_base_model('testB')
    assert len(summaries) == 2
    assert set(summaries.keys()) == {'testA', 'testB'}
    assert base_a.get('type') == 'sequential'
    assert base_b.get('type') == 'schnet'
    # We will now assume that it read everything else correctly
    assert base_a.get('image') is not None
    assert base_b.get('image') is None


if __name__ == '__main__':
    test_handler_creation()
    test_handler_double_creation()
    test_handler_deletion()
    TestBasicMoleculeGroup()
    TestBasicModelGroup()
    test_dataset_reading()
