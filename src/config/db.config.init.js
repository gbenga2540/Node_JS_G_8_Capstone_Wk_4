const mysql = require("mysql");
require("dotenv").config();
const password = process.env.password;
const { logger } = require("../utils/logger");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
});

connection.connect((err) => {
  if (err) logger.error(err.message);
});

module.exports = connection;
