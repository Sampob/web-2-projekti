const express = require('express');

const conn = require("./mysqlConn");
const router = express.Router();

router.get('/getActors:query', function (req, res) {
    const q = "'%" + req.params.query.substring(1) + "%'";

    let sql = "SELECT id, name FROM actors WHERE name LIKE " + q;

    conn.query(sql, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json(result);
        }
    });
});

router.get('/getActors', function (req, res) {
    let sql = "SELECT id, name FROM actors";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json(result);
        }
    });
});

router.get('/getActor:actor', function (req, res) {
    let sql = "SELECT id, name FROM actors WHERE name = '" + req.params.actor.substring(1) + "'";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;