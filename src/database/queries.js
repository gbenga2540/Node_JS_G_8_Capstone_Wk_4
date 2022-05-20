const { DB_NAME } = require("../utils/secrets");

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(50) NULL,
  last_name VARCHAR(50) NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL,
  created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
  )
  `;

const createNewUser = `
  INSERT INTO users VALUES(null, ?, ?, ?, ?,?, ?, ?, NOW())
  `;

const findUserByEmail = `
  SELECT * FROM users WHERE email = ?
  `;

const createTableProperties = `
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner INT NOT NULL,
  status ENUM('sold','available') NOT NULL DEFAULT 'available',
  price FLOAT NOT NULL,
  state VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  type ENUM('2 bedrooms','3 bedrooms','mini flat') NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
  )
  `;

// const updateProperty = `
// INSERT INTO properties VALUES(null, ?, ?, ?, ?,?, ?, ?, NOW())
// `;

const updateSoldProperty = `
  UPDATE properties SET status = "sold" WHERE id = ?`;

const deleteProperty = `
  DELETE FROM properties WHERE id = ?`;

const findProperty = `
  SELECT * FROM properties WHERE id = ?`;

const findAllProperties = `
  SELECT * FROM properties`;

const findPropertiesByType = `
  SELECT * FROM properties WHERE type = ?`;

module.exports = {
  createDB,
  dropDB,
  createTableUsers,
  createNewUser,
  findUserByEmail,
  createTableProperties,
  updateSoldProperty,
  deleteProperty,
  findProperty,
  findAllProperties,
  findPropertiesByType,
};
