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

//Routes in individual files, 'imported' here
const authenticationRoute = require("./routes/authenticationRoute");
const loginRoute = require("./routes/loginRoute");
const newUserRoute = require("./routes/newUserRoute");

app.get('/test', (req, res) => {
    res.send({express: 'BACKEND TEST'});
});

//Use these imported routes
app.use("/", authenticationRoute);
app.use("/", loginRoute);
app.use("/", newUserRoute);

//Start listening to requests at defined port
app.listen(port, () => console.log(`Listening port ${port}`));
