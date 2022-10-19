//Log in using email and password
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const router = express.Router();

router.post('/loginUser', async function (req, res) {
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

module.exports = router;