require('dotenv').config()

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 20,
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

module.exports = pool;