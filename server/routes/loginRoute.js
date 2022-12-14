//Log in using email and password
const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mysql = require("mysql");
const conn = require("./mysqlConn");

const router = express.Router();

router.post('/loginUser', async function (req, res) {
    const jsonObj = req.body;

    //Passwords in database are hashed, first fetch the hashed password
    const userPassword = await getHash(jsonObj, res);
    if (userPassword === 400) {
        res.status(400).send({
            text: "User not found",
            field: 2
        });
    } else {
        //Then compare hash and password
        try {
            bcrypt.compare(jsonObj.password, userPassword.password, function (err, result) {

                //If hash and password match, we create a jwt (token) and send it to client with the username
                if (result) {
                    const accessToken = jwt.sign({name: jsonObj.email}, process.env.TOKEN_SECRET, {expiresIn: "1h"})
                    res.status(202).json({accessToken: accessToken, username: userPassword.username});
                } else {
                    res.status(400).send({
                        text: "Wrong password",
                        field: 3
                    });
                }
            })
        } catch (e) {
            console.error(e);
        }
    }
});

function getHash(jsonObj) {
    let sql = "SELECT password, username FROM users WHERE email = " + mysql.escape(jsonObj.email);

    //Returns a promise containing hash and username
    //Username will be stored in client for later use
    return new Promise(function (resolve) {
        conn.query(sql, function (err, result) {
            if (err) throw err;
            //If no results come up, we know email is wrong
            if (result.length === 0) {
                resolve(400);
            } else {
                resolve(result[0]);
            }
        });
    });
}

module.exports = router;