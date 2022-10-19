const express = require('express');

const conn = require("./mysqlConn");
const mysql = require('mysql');

const router = express.Router();

//TODO Authenticate actor adding and editing
router.post('/addActor', function (req, res) {
    const jsonObj = req.body;

    let sql = "INSERT INTO actors (name)"
        + " VALUES (?)";

    try {
        conn.query(sql, [jsonObj.name], function (err) {
            if (err) {
                console.log(err);
                res.status(400).send("Error");
            } else {
                res.status(201).send("POST successful");
            }
        })
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;