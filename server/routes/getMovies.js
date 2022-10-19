const express = require('express');

const conn = require("./mysqlConn");
const router = express.Router();

router.get('/getMovies:query', function (req, res) {
    const q = "'%" + req.params.query.substring(1) + "%'";

    let sql = "SELECT title, description, poster FROM movies WHERE title LIKE " + q;

    conn.query(sql, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json(result);
        }
    });
});

router.get('/getMovies', function (req, res) {

    let sql = "SELECT title, description, poster FROM movies";

    conn.query(sql, function (err, result) {
        if (err) throw err;
        else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;