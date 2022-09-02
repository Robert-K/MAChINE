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

class TestBasicModelGroup:
    def test_model_addition(self):
        pass


if __name__ == '__main__':
    test_handler_creation()
    test_handler_double_creation()
    TestBasicMoleculeGroup()
    TestBasicModelGroup()
