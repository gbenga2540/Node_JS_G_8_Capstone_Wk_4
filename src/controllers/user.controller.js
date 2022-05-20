const User = require("../models/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res
      .status(400)
      .json({ status: "error", error: "Content can not be empty!" });
  }

  // Create a User
  const { email, first_name, last_name, password, phone, address, is_admin } =
    req.body;
  const user = new User(
    email,
    first_name,
    last_name,
    password,
    phone,
    address,
    is_admin
  );

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).json({
        status: "error",
        error: err.message || "Some error occurred while creating the User.",
      });
    else res.json({ status: "success", data });
  });
};

// Retrieve all users from the database
exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else res.json({ status: "success", data });
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  User.findById(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          error: "Error retrieving User with id " + req.params.id,
        });
      }
    } else
      res.json({
        status: "success",
        data,
      });
  });
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res
      .status(400)
      .json({ status: "error", error: "Content can not be empty!" });
  }
  const { id, email, phone } = req.body;
  User.updateById(Number(req.params.id), { email, phone }, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          error: "Error updating User with id " + req.params.id,
        });
      }
    } else res.json({ status: "success", data });
  });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  User.delete(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          error: "Could not delete User with id " + req.params.id,
        });
      }
    } else
      res.json({ status: "success", message: `User was deleted successfully!` });
  });
};
