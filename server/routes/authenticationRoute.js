const express = require('express');
const router = express.Router();

const jwt = require("jsonwebtoken");
router.post('/authenticateUser', function (req, res) {
    jwt.verify(req.body.accessToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if(decoded === undefined) res.status(401).send("User not authenticated");
        else res.status(200).send("User authenticated");
    });
});

module.exports = router;