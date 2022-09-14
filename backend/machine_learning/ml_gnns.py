import tensorflow as tf
from backend.utils.molecule_formats import smiles_to_mol_graph
from backend.machine_learning.models.schnet import make_schnet


def create_schnet_with_dataset(parameters, dataset, labels, loss, optimizer, metrics, batch_size):
    label = labels[0]  # Schnets do not support multiple labels
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
        embedding_dim=int(parameters.get('embeddingDimension')),
        readout_size=int(parameters.get('readoutSize')),
        depth=int(parameters.get('depth')),
    )

    model.compile(loss=loss, optimizer=optimizer, metrics=metrics)
    return model, ds


def smiles_to_schnet_input(smiles):
    # TODO: Convert molecule
    (nodes, edges, edges_i) = smiles_to_mol_graph(smiles)
    node_dim = nodes.shape[-1]
    edge_dim = edges.shape[-1]

    nodes = tf.RaggedTensor.from_tensor(tf.constant(nodes, dtype="float32", shape=[1, len(nodes), node_dim]))
    edges = tf.RaggedTensor.from_tensor(tf.constant(edges, dtype="float32", shape=[1, len(edges), edge_dim]))
    edges_i = tf.RaggedTensor.from_tensor(tf.constant(edges_i, dtype="int32", shape=[1, len(edges_i), 2]))
    return [nodes, edges, edges_i]
