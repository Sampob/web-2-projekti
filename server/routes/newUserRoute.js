const conn = require("./mysqlConn");

const express = require('express');
const bcrypt = require("bcrypt");

const router = express.Router();

router.post('/newUser', function (req, res) {
    const jsonObj = req.body;

    //User passwords are stored as hashes in database using bcrypt
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        let sql = "INSERT INTO users (username, email, password)"
            + " VALUES ( ?, ?, ?)";

        //Checks if error with SQL INSERT, and posts error to client
        try {
            conn.query(sql, [jsonObj.username, jsonObj.email, hash], function (err) {
                if (err) {
                    if (err.errno === 1062) {
                        res.status(406).send({
                            text: "Email already in use",
                            field: 2
                        });
                    } else {
                        res.status(400).send({
                            text: "POST was not successful",
                            field: 0
                        });
                    }
                } else {
                    res.status(201).send("POST successful");
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
});

module.exports = router;