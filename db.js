const dotenv = require('dotenv').config();
const mysql = require('mysql');
var fs = require('fs');

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_SCHEMA){
  fs.stat('.env', function(err, stat){
    if(err != null && err.code == 'ENOENT') {
      console.log("Please create .env file")
      process.exit(1);
    }
  });
}

const conn = mysql.createPool({
    host    : process.env.DB_HOST,
    user    : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
    connectionLimit: 2
  });
  

module.exports = conn;