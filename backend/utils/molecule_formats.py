import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem
from scipy.spatial.distance import squareform, pdist


def is_valid_molecule(smiles):
    """
    Checks if the internal molecules library can use a certain SMILES code

    :param smiles: SMILES code for a specific molecule
    :return: True if Chem can handle that SMILES code
    """
    m = Chem.MolFromSmiles(smiles, sanitize=False)
    if m is None:
        return False
    else:
        return Chem.SanitizeMol(m, catchErrors=True) == 0


def smiles_to_fingerprint(smiles, fingerprint_size=128, radius=2):
    """
    Converts a smiles code to a fingerprint vector with the given parameters

    :param smiles: A molecule's SMILES code
    :param fingerprint_size: fingerprint size for the resulting bit vector
    :param radius: radius for the resulting bit vector
    :return: fingerprint vector if Chem can handle the given smiles code
    """
    try:
        mol = Chem.MolFromSmiles(smiles)
        fingerprint = AllChem.GetMorganFingerprintAsBitVect(mol, radius=radius, nBits=fingerprint_size)
        return list(fingerprint)
    except (IndexError, ValueError, TypeError):
        return None


def smiles_to_mol_graph(smiles):
    """
    Converts a SMILES code to a mol graph

    :param smiles: SMILES code for a specific molecule
    :return: nodes, edges, edge_indices of the converted graph
    """
    try:
        mol = Chem.MolFromSmiles(smiles)
        mol = Chem.AddHs(mol)
        AllChem.EmbedMolecule(mol)
        AllChem.MMFFOptimizeMolecule(mol)

        conformer = mol.GetConformer()

        node_features = np.array([[a.GetAtomicNum()] for a in mol.GetAtoms()])
        node_positions = np.array([list(conformer.GetAtomPosition(i)) for i, _ in enumerate(mol.GetAtoms())])

        dist_mat = squareform(pdist(node_positions))

        edge_indices_forward = [[b.GetBeginAtomIdx(), b.GetEndAtomIdx()] for b in mol.GetBonds()]
        edge_indices_backward = [[b, a] for a, b in edge_indices_forward]
        edge_indices = np.array(edge_indices_forward + edge_indices_backward)

        edge_features = dist_mat[edge_indices[:, 0], edge_indices[:, 1]][..., None]

        return node_features, edge_features, edge_indices
    except (IndexError, ValueError, TypeError):
        return None, None, None
