/* const mysql = require("mysql2");
const dbConfig = require("../config/dbTestLocalhost.config");

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("successfully connected to local host TEST DB.");
});

module.exports = connection; */