import tensorflow as tf
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem
from scipy.spatial.distance import squareform, pdist

from backend.machine_learning.models.schnet import make_schnet


def create_schnet_with_dataset(parameters, dataset, labels, loss, optimizer, metrics, batch_size):
    label = labels[0]
    x, y = zip(*[(mol["x"]['mol_graph'], mol["y"][label]) for mol in dataset])
    nodes, edges, edges_i = zip(*x)

    node_dim = nodes[0].shape[-1]
    edge_dim = edges[0].shape[-1]

    nodes = tf.ragged.constant(nodes, dtype="float32", ragged_rank=1, inner_shape=(node_dim,))
    edges = tf.ragged.constant(edges, dtype="float32", ragged_rank=1, inner_shape=(edge_dim,))
    edges_i = tf.ragged.constant(edges_i, dtype="int32", ragged_rank=1, inner_shape=(2,))
    y = tf.constant(y)

    ds = tf.data.Dataset.from_tensor_slices(((nodes, edges, edges_i), y)).batch(batch_size)

    model = make_schnet(
        input_node_shape=[None, node_dim],
        input_edge_shape=[None, edge_dim],
        embedding_dim=int(parameters.get('embeddingDim')),
        readout_size=int(parameters.get('readoutSize')),
        depth=int(parameters.get('depth')),
    )

    model.compile(loss=loss, optimizer=optimizer, metrics=metrics)
    return model, ds


def smiles_to_mol_graph(smiles):
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
    except (IndexError, ValueError):
        return None, None, None
