var mysql = require('mysql');
const Fuse = require("fuse.js");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nats",
  database: "BookMate"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});