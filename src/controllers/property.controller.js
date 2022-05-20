const Property = require("../models/property.model");
const { logger } = require("../utils/logger");
const cloudinary = require("../config/cloudinary.config");

// Create and Save a new Property
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).json({
      status: "error",
      error: "Content can not be empty!",
    });
  }

  // Create a Property
  const { status, price, state, city, address, type, image_url } = req.body;
  const owner = req.user.id;
  const property = new Property(
    owner,
    status,
    price,
    state,
    city,
    address,
    type,
    image_url
  );

  // Save Property in the database
  Property.create(property, async (err, data) => {
    if (err)
      res.status(500).json({
        status: "error",
        error: err.message || "Some error occurred while creating the Property.",
      });
    else
      try {
        await cloudinary.uploader.upload(
          property.image_url,
          function (error, result) {
            if (error) {
              logger.error(error);
            } else {
              logger.info(`Image Uploaded`);
            }
          }
        );
      } catch (error) {
        logger.error(`Could not upload image ${error}`);
      }
    res.json({
      status: "success",
      data: data,
    });
  });
};

// Retrieve all Properties from the database
exports.findAll = (req, res) => {
  Property.find((err, data) => {
    if (err)
      res.status(500).json({
        status: "error",
        error: err.message || "Some error occurred while retrieving properties.",
      });
    else
      res.json({
        status: "success",
        data: data,
      });
  });
};

// Retrieve all Properties of same type
exports.findPropByType = (req, res) => {
  Property.findByType(req.query.type, (err, data) => {
    if (err)
      res.status(500).json({
        status: "error",
        error: err.message || "Some error occurred while retrieving properties.",
      });
    else
      res.json({
        status: "success",
        data: data,
      });
  });
};

// Find a single Property by Id
exports.findOne = (req, res) => {
  Property.findById(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found Property with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          status: "error",
          error: "Error retrieving Property with id " + req.params.id,
        });
      }
    } else
      res.json({
        status: "success",
        data: data,
      });
  });
};

// Sell a Property identified by the id in the request
exports.sell = (req, res) => {
  // Validate Request
  if (!req.body) {
    res
      .status(400)
      .json({ status: "error", error: "Content can not be empty!" });
  }
  const { id } = req.body;
  Property.updateById(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found Property with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          error: "Error updating Property with id " + req.params.id,
        });
      }
    } else
      res.json({
        status: "success",
        data: data,
      });
  });
};

// Delete a Property with the specified id in the request
exports.delete = (req, res) => {
  Property.delete(Number(req.params.id), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `Not found Property with id ${req.params.id}.`,
        });
      } else {
        res.status(500).json({
          status: "error",
          error: "Could not delete Property with id " + req.params.id,
        });
      }
    } else
      res.json({
        status: "success",
        data: `Property was deleted successfully!`,
      });
  });
};
