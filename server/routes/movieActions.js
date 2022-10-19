const express = require('express');

const conn = require("./mysqlConn");
const mysql = require('mysql');

const router = express.Router();

//TODO Authenticate movie adding and editing
router.post('/addMovie', function (req, res) {
    const jsonObj = req.body;

    let sql = "INSERT INTO movies (title, description)"
        + " VALUES (?, ?)";

    try {
        conn.query(sql, [jsonObj.title, jsonObj.description], function (err) {
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

router.put('/editMovie:movie', function (req, res) {
    let sql = '';

    if (req.body.poster !== undefined && req.body.description !== undefined) {
        sql = "UPDATE movies SET description = " + mysql.escape(req.body.description) +
            ", poster = " + mysql.escape(req.body.poster) +
            " WHERE title = '" + req.params.movie.substring(1) + "'";
    } else if (req.body.description !== undefined) {
        sql = "UPDATE movies SET description = " + mysql.escape(req.body.description) +
            " WHERE title = '" + req.params.movie.substring(1) + "'";
    }
    //TODO TEST!
    else if (req.body.poster !== undefined) {
        sql = "UPDATE movies SET poster = " + mysql.escape(req.body.poster) +
            " WHERE title = '" + req.params.movie.substring(1) + "'";
    }

    conn.query(sql, function (err) {
        if (err) {
            res.status(400).send("Error in update");
        } else {
            res.status(200).send("PUT successful");
        }
    });

});

module.exports = router;