import json
from multiprocessing import Pool, cpu_count
import pandas as pd
from rdkit import Chem
from rdkit.Chem import AllChem
from pathlib import Path
import pickle


def smiles_to_fingerprint(smiles, size=128, radius=2):
    mol = Chem.MolFromSmiles(smiles)
    fingerprint = AllChem.GetMorganFingerprintAsBitVect(mol, radius=radius, nBits=size)
    return list(fingerprint)


def smiles_to_fingerprints(smiles, sizes, radius=2):
    result_dict = dict()
    for size in sizes:
        result_dict[str(size)] = smiles_to_fingerprint(smiles, size, radius)
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

    print('converted smiles to input')
    label_result_list = []
    for label in labels:
        label_result_list.append(make_data_label_pairs(data=data[label].tolist(), label=label))

    print('created output-label-pairs')
    y_list = []
    for pairing in zip(*label_result_list):
        new_pairing = dict()
        for entry in pairing:
            new_pairing |= entry
        y_list.append(new_pairing)

    print('created output dictionary')
    fingerprints_labels_zip = zip(fingerprints, y_list)
    dataset = list()
    for fingerprints, label_list in fingerprints_labels_zip:
        dataset.append({'x': fingerprints, 'y': label_list})
    print('done')
    return dataset


def add_dataset_descriptor(dataset, name, image_file):
    """
    Takes a Dataset and adds it to a dictionary containing various fields

    :param dataset: The dataset. Presumably created using 'create_dataset'
    :param name: The name of the Dataset
    :param image_file: name of the image file in storage/data/images
    :return: A dictionary with the fields 'name', 'size', 'labels', 'image_file', 'dataset'
    """
    size = len(dataset)
    labels = list(dataset[0].get('y').keys())
    print(f'adding descriptor with size {size}, labels {labels}')
    print('length', len(dataset))
    return {'name': name, 'size': size, 'labels': labels, 'image_file': image_file, 'dataset': dataset}


def update_dataset_descriptor(old_file, name, image_file):
    return add_dataset_descriptor(unjson_my_set(old_file.get('dataset')), name, image_file)


def unjson_my_set(dataset):
    try:
        unjsoned_set = [json.loads(x) for x in dataset]
        return unjsoned_set
    except json.JSONDecodeError:
        return dataset


# HOW TO USE:
# Look at examples below
if __name__ == '__main__':
    # Example for creating a new dataset
    new_set = create_dataset(path="storage/csv_data/solubility.csv",
                             max_size=10000,
                             data_offset=125,
                             smiles_fingerprint_sizes=[128, 256, 512, 1024],
                             smiles_fingerprint_radius=2,
                             labels=['Solubility'])
    final_set = add_dataset_descriptor(new_set, 'Medium Solubility Set', 'solubility.png')

    # Example for changing an old set
    #in_file = (Path.cwd() / 'storage\\data' / 'smol_qm9.pkl').open('rb')
    #first = pickle.load(in_file)
    #in_file.close()
    #final_set = update_dataset_descriptor(first, 'QM9 Smol HLG', 'qm9.png') # replace with change_data... if already has descriptor

    file = (Path.cwd() / 'data' / 'out.pkl').open('wb')
    pickle.dump(final_set, file)
    file.close()
