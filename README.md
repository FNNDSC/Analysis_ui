# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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


### Using Docker

Use these commands for a production build.

```shell
 docker build -t local/analysis_ui .
 docker run --name analysis_ui -p 3000:3000 -d local/analysis_ui
 ```


 Use these commands for your local development build.

 ```shell
docker build -t local/analysis_ui:dev -f Dockerfile_dev .
docker run --rm -it -v $(pwd):/home/localuser -p 3000:3000 -u $(id -u):$(id -g) --name analysis_ui local/analysis_ui:dev

 ```
