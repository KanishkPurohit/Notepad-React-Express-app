# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts


## run the following commands in the terminal at your project's directory

### `npm install`
this command will install all node dependencies and modules required for the react app

## Now in the backend directory , run the following  list of commands for installing all the dependencies related to project backend

### `npm init (inotebook-backend)`

### `npm i express`
to install the express for creating the api for authenticatiion and operations  on notes.

### `npn i mongoose`
to install the mogoose in the backend to connect the database.

### `npm i -D nodemon`
nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

### `npm i --save express-validator`
install the express validator for validation.

### `npm i bcryptjs`
to secure the credential we install bcryptjs to convert the password/sensetive information into a hash  value.

### `npm install jsonwebtoken`
to sucure more we download JWT to authenticate a user with a json web token.

### `npm i cors`

## now run the following command in the parent directory of react-app

### `npm i react-router-dom concurrently`
to install the pakcage required to link diffrent pages in web app

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
to  get rid of this errors use the lint comment suggested by browser

also I've added a additional script in the package.json to run both the commands together
"both": "concurrently \"npm run start\" \"nodemon backend/index.js\""

### `npm run both`
use this command to run the deployment server and nodemon together in single terminal
also If you want to use both npm run start and nodemon command together then you are free to use by simply opening seperate terminals in VScode