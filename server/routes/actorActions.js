const express = require('express');

const conn = require("./mysqlConn");

const authentication = require("../functions/authentication");

const router = express.Router();

router.post('/addActor', function (req, res) {
    let sql = "INSERT INTO actors (name)"
        + " VALUES (?)";

    if (authentication(req.body.accessToken)) {
        conn.query(sql, [req.body.name], function (err) {
            if (err) {
                if (err.errno === 1048) {
                    res.status(400).send({
                        text: "Name can't be null"
                    });
                } else if (err.errno === 1062) {
                    res.status(400).send({
                        text: "Actor already in database"
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

router.put('/editActor:actor', function (req, res) {
    if (authentication(req.body.accessToken)) {
        res.status(501);
    } else {
        res.status(401).send({
            text: "Unauthorized"
        });
    }
});

router.delete('/deleteActor/:actor/:token', function (req, res) {
    if (authentication(req.params.token)) {
        conn.query("DELETE FROM actor_movie WHERE actor_id = (SELECT id FROM actors WHERE name = '"
            + req.params.actor + "')");
        let sql = "DELETE FROM actors WHERE name = '" + req.params.actor + "'";
        conn.query(sql, function (err, response) {
            if (err) {
                console.log(err);
                res.status(400).send({
                    text: "Error"
                });
            } else if (response.affectedRows === 0) {
                res.status(400).send({
                    text: "No actor found"
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