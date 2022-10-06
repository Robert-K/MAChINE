import math
from multiprocessing import Pool, cpu_count
import pandas as pd
from pathlib import Path
import pickle
from backend.utils.molecule_formats import *
import numpy as np

_version = 5


def smiles_to_fingerprints(smiles, sizes, radius=2):
    result_dict = dict()
    for size in sizes:
        result_dict[str(size)] = smiles_to_fingerprint(smiles, size, radius)
        if not result_dict[str(size)]:
            return None
    return result_dict


def smiles_list_to_fingerprint_input(smiles_list, sizes, radius=2):
    result = list()
    for smiles in smiles_list:
        result.append((smiles, sizes, radius))
    return result


def make_data_label_pairs(data, label):
    result_list = []
    for x in data:
        result_list.append({str(label): x})
    return result_list


def create_dataset(path: str,
                   max_size: int,
                   data_offset: int,
                   labels: list,
                   smiles_fingerprint_sizes: list,
                   smiles_fingerprint_radius: int):
    """
    Creates a new Dataset with a given csv file path, a given size, starting at a certain point, with specific labels
    and fingerprint sizes.

    :param path: Path to the .csv file, from this file
    :param max_size: How many entries the dataset should have at most (sometimes it has fewer actual entries)
    :param data_offset: At what point do we take data from the .csv file (ex: 5 means we start at the 6th entry)
    :param labels: List of strings of labels that we have data for
    :param smiles_fingerprint_sizes: Array of integers (powers of 2, probably), unknown what fingerprints are specifically
    :param smiles_fingerprint_radius: Just leave this at 2. No idea what it does
    :return: A list of dictionaries containing inputs and outputs. Pickle & save or add a descriptor
    """
    csv = pd.read_csv(path)
    data = csv[min(data_offset, len(csv)):min(max_size + data_offset, len(csv))]
    data_smiles = data["SMILES"].tolist()
    print(f'creating set with {min(max_size, len(csv))} entries, starting at entry {data_offset}')

    print(f'loaded set with labels: {labels} of {list(csv.columns)}')

    if not labels or not set(labels).issubset(set(csv.columns)):
        labels = list(csv.columns)
        raise 'Error with label selection'

    num_workers = max(cpu_count() - 2, 1)

    print(f'using {num_workers} threads')
    with Pool(num_workers) as p:
        fingerprints_input = smiles_list_to_fingerprint_input(data_smiles, smiles_fingerprint_sizes,
                                                              smiles_fingerprint_radius)
        fingerprints = p.starmap(smiles_to_fingerprints, fingerprints_input)
        data_mol_graphs = p.map(smiles_to_mol_graph, data_smiles)

    print('converted smiles to input')
    label_result_list = []
    for label in labels:
        label_result_list.append(make_data_label_pairs(data=data[label].tolist(), label=label))

    # creates list of dictionaries with label: data pairs for data  ex [{'homo': 0.0552, 'lumo': 15.2},...]
    print('created output-label-pairs')
    y_list = []
    for pairing in zip(*label_result_list):
        new_pairing = dict()
        for entry in pairing:
            new_pairing |= entry
        y_list.append(new_pairing)
    print('created output dictionary')

    # creates dictionary with labels for all different input types
    # Current input types are SMILES fingerprints & mol_graphs (v3)
    x_list = []
    for fingerprint, mol_graph in zip(fingerprints, data_mol_graphs):
        if mol_graph[0] is not None and fingerprint:
            x_list.append({'fingerprints': fingerprint, 'mol_graph': mol_graph})
        else:
            x_list.append(None)
    print('created input dictionary')

    # pairs each entry of our input with an entry of our output lists
    data_zip = zip(x_list, y_list)
    dataset = list()
    for input_dict, output_dict in data_zip:
        if input_dict:
            dataset.append({'x': input_dict, 'y': output_dict})
    print('done')
    return dataset


def add_dataset_descriptor(dataset, name, histograms, parameters):
    """
    Takes a Dataset and adds it to a dictionary containing various fields

    :param dataset: The dataset. Presumably created using 'create_dataset'
    :param name: The name of the Dataset
    :param histograms: histogram of the dataset
    :param parameters: parameters that were used to create the dataset
    :return: A dictionary with the fields 'name', 'size', 'labels', 'dataset'
    """
    size = len(dataset)
    labels = list(dataset[0].get('y').keys())
    print(f'adding descriptor with size {size}, labels {labels}')
    return {'name': name, 'size': size, 'labels': labels, 'dataset': dataset,
            'version': _version, 'histograms': histograms, 'parameters': parameters}


def create_complete_dataset(path, max_size, data_offset, smiles_fingerprint_sizes, smiles_fingerprint_radius, labels,
                            name):
    raw_dataset = create_dataset(path,
                                 max_size,
                                 data_offset,
                                 labels,
                                 smiles_fingerprint_sizes,
                                 smiles_fingerprint_radius)
    histograms = create_histograms(raw_dataset, labels)
    return add_dataset_descriptor(raw_dataset,
                                  name,
                                  histograms,
                                  [path, max_size, data_offset, smiles_fingerprint_sizes, smiles_fingerprint_radius,
                                   labels, name])


def update_dataset(path):
    path = (Path.cwd() / path)
    with path.open('rb') as old_set_file_read:
        old_set = pickle.load(old_set_file_read)

    if old_set.get('version') == _version:
        return old_set

    try:
        new_set = create_complete_dataset(*old_set.get('parameters'))
        with path.open('wb') as old_set_file_write:
            pickle.dump(new_set, old_set_file_write)

        return old_set

    except ValueError:
        print('Dataset too old to automatically upgrade')


def create_histograms(dataset, labels):
    histograms = dict()

    # prep: separate data by label
    columns_by_label = dict()
    for label in labels:
        columns_by_label[label] = list()

    for entry in dataset:
        for [label, value] in entry['y'].items():
            columns_by_label[label].append(value)

    # create histogram for each label
    for [label, data] in columns_by_label.items():
        # bucket count is an arbitrary value, change corresponding to degree of detail required
        hist, bin_edges = np.histogram(data, math.floor(len(data) / 100))
        histograms[label] = dict({
            'buckets': hist.tolist(),
            'bin_edges': bin_edges.tolist()
        })

    return histograms


# HOW TO USE:
# Look at examples below
if __name__ == '__main__':
    update_dataset('../../storage/data/med_hiv.pkl')
    '''
    Example for creating a new dataset
    new_set = create_complete_dataset(path="../../storage/csv_data/solubility.csv",
                                      max_size=100,
                                      data_offset=0,
                                      smiles_fingerprint_sizes=[128, 512, 1024],
                                      smiles_fingerprint_radius=2,
                                      labels=['Solubility'],
                                      name='Medium Solubility Set')

    file = (Path.cwd() / 'output.pkl').open('wb')
    pickle.dump(new_set, file)
    file.close()
    '''
