# Copyright André Eberhard 2022 | All rights reserved.
import tensorflow as tf
from keras.engine.base_layer import Layer
from keras.utils.generic_utils import get_custom_objects
from tensorflow import keras


class ShiftedSoftPlus(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @tf.function
    def call(self, inputs, *args, **kwargs):
        x = inputs
        return keras.activations.softplus(x) - keras.backend.log(2.0)


class SchNetContFilterConvolution(Layer):
    def __init__(self, embedding_dim, **kwargs):
        super().__init__(**kwargs)
        self.embedding_dim = embedding_dim
        self.filter_generator_1 = keras.layers.Dense(embedding_dim, activation="ssp")
        self.filter_generator_2 = keras.layers.Dense(embedding_dim, activation="ssp")

    @tf.function
    def call(self, inputs, *args, **kwargs):
        nodes, edges, edges_i = inputs

        nodes_starts, nodes_ends = edges_i[:, 0], edges_i[:, 1]

        nodes_filters = self.filter_generator_1(edges)
        nodes_filters = self.filter_generator_2(nodes_filters)

        nodes_conv = tf.gather(nodes, nodes_ends)
        nodes_conv *= nodes_filters

        nodes_out = tf.tensor_scatter_nd_add(
            tensor=nodes,
            indices=nodes_starts[..., None],
            updates=nodes_conv
        )

        return nodes_out


class SchNetInteractionBlock(Layer):
    def __init__(self, embedding_dim, **kwargs):
        super().__init__(**kwargs)
        self.embedding_dim = embedding_dim

        self.atom_wise_1 = keras.layers.Dense(embedding_dim, activation="linear")
        self.atom_wise_2 = keras.layers.Dense(embedding_dim, activation="ssp")
        self.atom_wise_3 = keras.layers.Dense(embedding_dim, activation="linear")

        self.cfconv = SchNetContFilterConvolution(embedding_dim=embedding_dim)

    @tf.function
    def call(self, inputs, *args, **kwargs):
        nodes, edges, edges_i = inputs

        nodes_embed = self.atom_wise_1(nodes)
        nodes_embed = self.cfconv([nodes_embed, edges, edges_i])
        nodes_embed = self.atom_wise_2(nodes_embed)
        nodes_embed = self.atom_wise_3(nodes_embed)

        nodes_residual = nodes + nodes_embed
        return nodes_residual


class SchNetWrapper(Layer):
    def __init__(self, depth, embedding_dim, readout_size, **kwargs):
        super().__init__(**kwargs)
        self.depth = depth
        self.embedding_dim = embedding_dim

        self.embedding = keras.layers.Dense(embedding_dim, activation="linear")
        self.interactions = [SchNetInteractionBlock(embedding_dim=embedding_dim) for _ in range(depth)]

        self.out_1 = keras.layers.Dense(readout_size, activation="ssp")
        self.out_2 = keras.layers.Dense(readout_size, activation="ssp")
        self.out_3 = keras.layers.Dense(readout_size, activation="ssp")
        self.out_4 = keras.layers.Dense(1, activation="linear")

    @tf.function
    def schnet_block(self, inputs):
        nodes, edges, edges_i = inputs
        nodes = self.embedding(nodes)

        for interaction in self.interactions:
            nodes = interaction([nodes, edges, edges_i])

        nodes = self.out_1(nodes)
        nodes = self.out_2(nodes)
        nodes = self.out_3(nodes)

        nodes = tf.math.reduce_sum(nodes, axis=0)[None, ...]

        y = self.out_4(nodes)[:, -1]

        return y

    @tf.function
    def call(self, inputs, *args, **kwargs):
        nodes, edges, edges_i = inputs
        y = tf.map_fn(
            fn=self.schnet_block,
            elems=(nodes, edges, edges_i),
            fn_output_signature=tf.float32
        )
        return y


def make_schnet(input_node_shape, input_edge_shape, embedding_dim, readout_size, depth):
    nodes_input = keras.Input(shape=input_node_shape, ragged=True, dtype="float32", name="nodes_input")
    edges_input = keras.Input(shape=input_edge_shape, ragged=True, dtype="float32", name="edges_input")
    edges_i_input = keras.Input(shape=(None, 2), ragged=True, dtype="int32", name="edges_i_input")

    schnet_model = SchNetWrapper(
        embedding_dim=embedding_dim,
        readout_size=readout_size,
        depth=depth
    )

    y = schnet_model([nodes_input, edges_input, edges_i_input])

    model = keras.Model(inputs=[nodes_input, edges_input, edges_i_input], outputs=y)
    return model


get_custom_objects().update({'ssp': ShiftedSoftPlus})


