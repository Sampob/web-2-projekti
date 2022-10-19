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

        //TODO Duplicate email handling
        conn.query(sql, [jsonObj.username, jsonObj.email, hash], function (err) {
            if (err) {
                console.log("Insertion into 'users' table was not successful!", err);
                res.status(400).send("POST was not successful");
            } else {
                res.status(201).send("POST successful");
            }
        });
    });
});

module.exports = router;