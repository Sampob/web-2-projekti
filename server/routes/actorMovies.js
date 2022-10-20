const express = require('express');

const conn = require("./mysqlConn");

const authentication = require("../functions/authentication");

const router = express.Router();

//TODO Verify actor is in database
router.put('/editTableActorMovie:actor', function (req, res){

    if(authentication(req.body.accessToken)) {
        let movie = '';
        let sql = '';
        let error = null;
        conn.query("DELETE FROM actor_movie WHERE actor_id = (SELECT actors.id FROM actors WHERE actors.name = '" + req.params.actor.substring(1) + "')");
        req.body.movies.map((e) => {
            movie = e;
            sql = "INSERT INTO actor_movie (movie_id, actor_id) VALUES ((select movies.id from movies where movies.id = '"
                + movie + "'), (select actors.id from actors where actors.name = '" + req.params.actor.substring(1) + "'))";
            conn.query(sql, function (err) {
                error = err;
            });
        });
        if(error !== null) res.status(400).send(error);
        else res.status(200).send("PUT Successful");
    } else {
        res.status(401).send({
            text: "Unauthorized"
        });
    }
});

router.get('/selectActorMovies:actor', function (req, res) {
    let sql = "SELECT m.id, m.title FROM movies as m INNER JOIN actor_movie as c ON m.id = c.movie_id INNER JOIN actors as q ON c.actor_id = q.id WHERE q.name = '" + req.params.actor.substring(1) + "'";
    conn.query(sql, function (err, result) {
        if(err) {
            res.status(400).send("Error");
        } else res.status(200).send(result);
    });
});

router.get('/selectMovieActors:movie', function (req, res) {
    let sql = "SELECT q.id, q.name FROM movies as m INNER JOIN actor_movie as c ON m.id = c.movie_id INNER JOIN actors as q ON c.actor_id = q.id WHERE m.title = '" + req.params.movie.substring(1) + "'";
    conn.query(sql, function (err, result) {
        if(err) {
            res.status(400).send("Error");
        } else res.status(200).send(result);
    });
});

module.exports = router;