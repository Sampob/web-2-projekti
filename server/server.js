const express = require('express');
const app = express();

//Module to use env files
const dotenv = require('dotenv');
dotenv.config();

//Server port defined in .env file
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(express.json());
app.use(cors());

//Logs http requests and what's sent
const logger = require('morgan');
app.use(logger('dev'));

//Routes in individual files, 'imported' here
const authenticationRoute = require("./routes/authenticationRoute");
const loginRoute = require("./routes/loginRoute");
const newUserRoute = require("./routes/newUserRoute");
const movieActions = require("./routes/movieActions");
const getMovies = require("./routes/getMovies");
const actorActions = require("./routes/actorActions");
const getActors = require("./routes/getActors");
const actorMovies = require("./routes/actorMovies");

app.get('/test', (req, res) => {
    res.send({express: 'BACKEND TEST'});
});

const serverRoutes = [authenticationRoute, loginRoute, newUserRoute, movieActions, getMovies, actorActions, getActors, actorMovies]

//Use these imported routes
app.use("/", serverRoutes);

//Start listening to requests at defined port
app.listen(port, () => console.log(`Listening port ${port}`));
