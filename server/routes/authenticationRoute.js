const express = require('express');
const router = express.Router();

const authentication = require("../functions/authentication");

//After logging in, client gets a JWT (token) and calls this to verify it.
router.post('/authenticateUser', function (req, res) {
    if (authentication(req.body.accessToken)) res.status(200).send("User authenticated");
    else res.status(401).send("User not authenticated");
});

module.exports = router;