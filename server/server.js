const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(express.json());
app.use(cors());

const authenticationRoute = require("./routes/authenticationRoute");
const loginRoute = require("./routes/loginRoute");
const newUserRoute = require("./routes/newUserRoute");

app.get('/test', (req, res) => {
    res.send({express: 'BACKEND TEST'});
});

app.use("/", authenticationRoute);
app.use("/", loginRoute);
app.use("/", newUserRoute);

app.listen(port, () => console.log(`Listening port ${port}`));
