import multiprocessing
import os
import tensorflow as tf

count = max(int(multiprocessing.cpu_count() / 5), 1)
tf.config.threading.set_intra_op_parallelism_threads(count)
tf.config.threading.set_inter_op_parallelism_threads(count)

os.environ['TF_NUM_INTEROP_THREADS'] = f'{count}'
os.environ['TF_NUM_INTRAOP_THREADS'] = f'{count}'