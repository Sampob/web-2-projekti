const express = require('express');

const conn = require("./mysqlConn");
const mysql = require('mysql');

const authentication = require("../functions/authentication");

const router = express.Router();

//TODO Error module for unified errors
router.post('/addMovie', function (req, res) {
    if (authentication(req.body.accessToken)) {
        let sql = "INSERT INTO movies (title, description)"
            + " VALUES (?, ?)";

        conn.query(sql, [req.body.title, req.body.description], function (err) {
            if (err) {
                if (err.errno === 1048) {
                    res.status(400).send({
                        text: "Title can't be null"
                    });
                } else if (err.errno === 1062) {
                    res.status(400).send({
                        text: "Movie already in database"
                    });
                } else {
                    console.log(err);
                    res.status(400).send({
                        text: "Error"
                    });
                }
            } else {
                res.status(201).send("POST successful");
            }
        });
    } else {
        res.status(401).send({
            text: "Unauthorized"
        });
    }
});

router.put('/editMovie/:movie', function (req, res) {
    if (authentication(req.body.accessToken)) {
        let sql = '';
        if (req.body.poster !== undefined && req.body.description !== undefined) {
            sql = "UPDATE movies SET description = " + mysql.escape(req.body.description) +
                ", poster = " + mysql.escape(req.body.poster) +
                " WHERE title = '" + req.params.movie + "'";
        } else if (req.body.description !== undefined) {
            sql = "UPDATE movies SET description = " + mysql.escape(req.body.description) +
                " WHERE title = '" + req.params.movie + "'";
        }
        //TODO TEST!
        else if (req.body.poster !== undefined) {
            sql = "UPDATE movies SET poster = " + mysql.escape(req.body.poster) +
                " WHERE title = '" + req.params.movie + "'";
        }

        conn.query(sql, function (err) {
            if (err) {
                if (err.errno === 1048) {
                    res.status(400).send({
                        text: "Title can't be null"
                    });
                } else if (err.errno === 1065) {
                    res.status(400).send({
                        text: "Empty edit"
                    })
                } else {
                    console.log(err);
                    res.status(400).send({
                        text: "Error"
                    });
                }
            } else {
                res.status(200).send("PUT successful");
            }
        });
    } else {
        res.status(401).send({
            text: "Unauthorized"
        });
    }
});

router.delete('/deleteMovie/:movie/:token', function (req, res) {
    if (authentication(req.params.token)) {
        conn.query("DELETE FROM actor_movie WHERE movie_id = (SELECT id FROM movies WHERE title = '"
            + req.params.movie + "')");
        let sql = "DELETE FROM movies WHERE title = '" + req.params.movie + "'";
        conn.query(sql, function (err, response) {
            if (err) {
                console.log(err);
                res.status(400).send({
                    text: "Error"
                });
            } else if (response.affectedRows === 0) {
                res.status(400).send({
                    text: "No such movie found"
                });
            } else {
                res.status(200).send("DELETE successful");
            }
        });
    } else {
        res.status(401).send({
            text: "Unauthorized"
        });
    }
});

module.exports = router;