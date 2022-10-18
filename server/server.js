const express = require('express');
const app = express();
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql');
const util = require('util');
const port = process.env.PORT || 5000;
const dbConfig = require("./config/db.config.js");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cors = require('cors');

app.use(express.json());
app.use(cors());


const conn = mysql.createConnection(dbConfig);
util.promisify(conn.query).bind(conn);
conn.connect((err) => {
    if (err) throw err
});

app.listen(port, () => console.log(`Listening port ${port}`));

app.get('/test', (req, res) => {
    res.send({express: 'BACKEND TEST'});
});

app.post('/authenticateUser', function (req, res) {
    jwt.verify(req.body.accessToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if(decoded === undefined) res.status(401).send("User not authenticated");
        else res.status(200).send("User authenticated");
    });
});

app.post('/newUser', function (req, res) {
    const jsonObj = req.body;

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        let sql = "INSERT INTO users (username, email, password)"
        + " VALUES ( ?, ?, ?)";

        conn.query(sql, [jsonObj.username, jsonObj.email, hash], function (err) {
            if(err) {
                console.log("Insertion into 'users' table was not successful!", err);
                res.status(400).send("POST was not successful");
            } else {
                res.status(201).send("POST successful");
            }
        });
    });
});

//Log in using email and password
app.post('/loginUser', async function (req, res) {
    const jsonObj = req.body;

    //Passwords in database are hashed, first fetch the hashed password
    const userPassword = await getHash(jsonObj, res);

    //Then compare hash and password
    try {
        bcrypt.compare(jsonObj.password, userPassword.password, function (err, result) {

            //If hash and password match, we create a jwt token and send it to client
            if (result) {
                const accessToken = jwt.sign({name: jsonObj.email}, process.env.TOKEN_SECRET, {expiresIn: "1h"})
                res.status(202).json({accessToken: accessToken, username: userPassword.username});
            } else {
                res.status(400).send("Wrong password");
            }
        })
    } catch (e) {
        console.log(e);
    }
});

function getHash(jsonObj, res) {
    let sql = "SELECT password, username FROM users WHERE email = " + mysql.escape(jsonObj.email);

    //Returns a promise containing hash and username
    //Username will be stored in client for later use
    return new Promise(function (resolve, reject) {
        conn.query(sql, function (err, result) {
            if (err) throw err;
            //If no results come up, we know email is wrong
            if (result.length === 0) {
                res.status(400).send("Wrong email");
                reject();
            } else {
                resolve(result[0]);
            }
        });
    });
}
