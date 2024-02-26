const mysql = require("mysql2");
const dbConfig = require("../config/db.config.js");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  dateStrings: true
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("successfully connected to DB.");
});

module.exports = connection;