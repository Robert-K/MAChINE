from pathlib import Path
import pickle
if __name__ == '__main__':
    in_file = (Path.cwd() / 'output.pkl').open('rb')
    first = pickle.load(in_file)
    print('Set a breakpoint here to inspect the dataset in the Debugger')
    in_file.close()