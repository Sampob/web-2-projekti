const jwt = require("jsonwebtoken");

//To authorize the client, call function with jwt token 'token'.
//Token secret is stored in .env file.
//Returns true if user authenticated, false if not.
module.exports = (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        return decoded !== undefined;
    });
}