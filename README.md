![MAChINE Logo](https://kosro.de/share/machine.svg)
<img align="right" src="frontend/public/molele.svg" height=150 />

A [PSE](https://pp.ipd.kit.edu/lehre/SS2022/pse) project by [13thWitch](https://github.com/13thWitch), [AnoukSommer](https://github.com/AnoukSommer), [CSCMe](https://github.com/CSCMe), [EliteStudent420](https://github.com/EliteStudent420), [Viola2345](https://github.com/Viola2345) & [Robert-K](https://github.com/Robert-K)

Supervised by [André Eberhard](https://github.com/patchmeifyoucan)

---

## <img src="frontend/public/molele.svg" height=18 /> With MAChINE you can:
- Draw any molecule imaginable and preview it in 3D
- Configure and train machine learning models to predict properties of molecules
- Analyze your molecules for various properties with the models you trained
- Compare your molecules and models to other users&apos; creations

---

# Extendability

### Adding a Model Type

0. Check if your model requires a different molecule format. (currently implemented: fingerprint vector, mol graph)
    1. Update [create_dataset in create_dataset.py](backend/scripts/datasets/create_dataset.py) to include your new molecule format
    2. Increment the version number in create_dataset.py & storage_handler.py
    3. Update update_dataset and run for every existing dataset
1. Place your custom model type in the [machine_learning/models folder](/backend/machine_learning/models)
2. Edit [baseModels.json](backend/storage/models/baseModels.json)
   1. Add a new Entry. The name for the type chosen here will be used in ml_dicts and ModelConfigPage to run appropriate code 
   2. Set your default parameters. The parameters for your model type are defined here. lossFunction and optimizer in parameters are required, as is metrics.
3. Create a file in /backend/machine_learning to hold your model and dataset creation functions
4. Implement a function that returns a tuple containing A: your built model, B: A dataset compatible with your model
5. Implement a function that converts molecules to a valid input format for your model
6. Enter your new functions into the proper [ml_dicts](backend/machine_learning/ml_dicts.py)
7. Build a React Component to customize your model and place them in [components/modelConfig](frontend/src/components/models/modelConfig)
8. Update [modelTypeSpecificComponents](frontend/src/routes/ModelConfigPage.js) to contain your new components

### Adding Datasets
0. Find your source csv file, ensure it has smiles codes and choose labels you want to include
1. In [create_dataset.py](backend/scripts/datasets/create_dataset.py) run create_complete_dataset with your parameters
2. Rename output.pkl and move it to [backend/storage/data](backend/storage/data)
3. Restart the backend

### Enabling multi-label Training
- Edit [schnet.py](backend/machine_learning/models/schnet.py) to allow it to train on multiple labels
- Edit [create_schnet_with_dataset](backend/machine_learning/ml_gnns.py) to take multi-label data from datasets (see [ml_fnns.py](backend/machine_learning/ml_fnns.py) for an example)
- Edit [handleChecked](frontend/src/components/datasets/DatasetInfo.js) to allow the user to select multiple labels
- Everything else should work without further modification
---

# Special Usage

### Admin Mode
- In any frontend page, type "adminmode" on your keyboard to enter admin mode
- You can edit the server address by clicking on the server status icon
- You can delete scoreboard entries on the scoreboard page by clicking the 🗑️ Icon (or deleting all)

---

# Bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---

## Commit Message Etiquette

Start commit messages with `ADD:`, `UPD:`, `FIX:` or `DEL:` corresponding to change.


[![forthebadge](https://forthebadge.com/images/badges/powered-by-energy-drinks.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/designed-in-ms-paint.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-badges.svg)](https://forthebadge.com)
