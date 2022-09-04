import pytest

from backend.utils import molecule_formats as mf


@pytest.mark.parametrize(
    'test_smiles, test_radius, test_fingerprint_size',
    [
        ('C', 2, 128),
        ('CC', 2, 256),
        ('CCC', 2, 512),
        ('COCO', 2, 1024),
        ('COOOO', 3, 128),
    ],
)
def test_fingerprint_conversion(test_smiles, test_radius, test_fingerprint_size):
    converted = mf.smiles_to_fingerprint(test_smiles, test_fingerprint_size, test_radius)
    assert type(converted) is list, 'Converted Molecule should be a list'
    assert len(converted) == test_fingerprint_size, 'Converted Molecule size needs to match the given parameter'


@pytest.mark.parametrize(
    'test_smiles, test_radius, test_fingerprint_size',
    [
        ('abv', 2, 128),
        ('CC', 2, '128'),
        ('CC', '2', 128)
    ],
)
def test_faulty_fingerprint_conversion(test_smiles, test_radius, test_fingerprint_size):
    converted = mf.smiles_to_fingerprint(test_smiles, test_fingerprint_size, test_radius)
    assert converted is None, 'Molecule should not get converted'


@pytest.mark.parametrize(
    'test_smiles',
    [
        'C',
        'CC',
        'COO',
        'COOOOO',
        'COOOOOOOOOOO',
    ],
)
def test_mol_graph_conversion(test_smiles):
    converted = mf.smiles_to_mol_graph(test_smiles)
    assert type(converted) is tuple, 'Converted Molecule should be a 3-Tuple'
    assert len(converted) == 3, 'Converted Molecule should be a 3-Tuple'
    (nodes, edges, edges_i) = converted
    assert nodes is not None, 'No part of converted molecule should be None'
    assert edges is not None, 'No part of converted molecule should be None'
    assert edges_i is not None, 'No part of converted molecule should be None'
    assert nodes.shape[1] == 1, 'Elements in nodes are 1-Dimensional'
    assert edges.shape[1] == 1, 'Elements in edges are 1-Dimensional'
    assert edges_i.shape[1] == 2, 'Elements in edges_i are 2-Dimensional'


@pytest.mark.parametrize(
    'test_smiles',
    [
        2,
        'awd',
        list('COO'),
    ],
)
def test_faulty_mol_graph_conversion(test_smiles):
    converted = mf.smiles_to_mol_graph(test_smiles)
    assert type(converted) is tuple, 'Converted Molecule should be a 3-Tuple'
    assert len(converted) == 3, 'Converted Molecule should be a 3-Tuple'
    (nodes, edges, edges_i) = converted
    assert nodes is None, 'Converted molecule should be None'
    assert edges is None, 'Converted molecule should be None'
    assert edges_i is None, 'Converted molecule should be None'
