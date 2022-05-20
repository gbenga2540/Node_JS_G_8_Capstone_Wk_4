const db = require("../config/db.config");
const { logger } = require("../utils/logger");
const queries = require("../database/queries");

// constructor
class Property {
  constructor(owner, status, price, state, city, address, type, image_url) {
    this.owner = owner;
    this.status = status;
    this.price = price;
    this.state = state;
    this.city = city;
    this.address = address;
    this.type = type;
    this.image_url = image_url;
  }
  static create(newProperty, result) {
    db.query(
      `INSERT INTO properties VALUES(null, ?,?, ?, ?,?, ?, ?,?, NOW())`,
      [
        newProperty.owner,
        newProperty.status,
        newProperty.price,
        newProperty.state,
        newProperty.address,
        newProperty.city,
        newProperty.type,
        newProperty.image_url,
      ],
      (err, res) => {
        if (err) {
          logger.error(err.message);
          result(err, null);
          return;
        }

        console.log("Uploaded Property: ", { ...newProperty });
        result(null, { id: res.insertId, ...newProperty });
      }
    );
  }

  static updateById(id, result) {
    db.query(queries.updateSoldProperty, [id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("property sold: ");
      result(null, res);
    });
  }

  static delete(id, result) {
    db.query(queries.deleteProperty, id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("deleted property with id: ", id);
      result(null, res);
    });
  }

  static findById(id, result) {
    db.query(queries.findProperty, [id], (err, res) => {
      if (err) {
        logger.error(err.message);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found property: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found
      result({ kind: "not_found" }, null);
    });
  }

  static find(cb) {
    db.query(queries.findAllProperties, (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        return cb(null, res);
      }
      cb({ kind: "not_found" }, null);
    });
  }

  static findByType(type, result) {
    db.query(queries.findPropertiesByType, type, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length > 0) {
        console.log("Found properties of type");
        return result(null, res);
      }
      console.log("properties: ", res);
      return result(null, res);
      result({ kind: "not_found" }, null);
    });
  }
}

module.exports = Property;
