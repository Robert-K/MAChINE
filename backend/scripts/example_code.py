from multiprocessing import Pool

import numpy as np
import pandas as pd
import tensorflow as tf
from keras.losses import MeanSquaredError
from keras.optimizers import Adam
from rdkit import Chem
from rdkit.Chem import AllChem
from scipy.spatial.distance import squareform, pdist

from backend.machine_learning.models.schnet import make_schnet


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


def smiles_to_fingerprint(smiles, radius=2, size=128):
    mol = Chem.MolFromSmiles(smiles)
    fingerprint = AllChem.GetMorganFingerprintAsBitVect(mol, radius=radius, nBits=size)
    return list(fingerprint)


tf.config.run_functions_eagerly(True)

dataset = "qm9.csv"
n_datapoints = 1000
label = "homo"
batch_size = 16

data = pd.read_csv(dataset)[:n_datapoints]
data_smiles = data["SMILES"].tolist()
data_labels = data[label].tolist()

with Pool(4) as p:
    # data_fingerprints = p.map(smiles_to_fingerprint, data_smiles)
    data_mol_graphs = p.map(smiles_to_mol_graph, data_smiles)

nodes, edges, edges_i, y = zip(*[(nodes, edges, edges_i, y) for (nodes, edges, edges_i), y in zip(data_mol_graphs, data_labels) if nodes is not None])

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
    embedding_dim=128,
    readout_size=1,
    depth=3
)

model.compile(loss=MeanSquaredError(), optimizer=Adam())
model.fit(ds, epochs=10, verbose=1)

print("done")
