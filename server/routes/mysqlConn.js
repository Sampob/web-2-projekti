const mysql = require('mysql');
const util = require('util');
const dbConfig = require("../config/db.config.js");

const conn = mysql.createConnection(dbConfig);
util.promisify(conn.query).bind(conn);
conn.connect((err) => {
    if (err) throw err
    console.log("Connected");
});

module.exports = conn;