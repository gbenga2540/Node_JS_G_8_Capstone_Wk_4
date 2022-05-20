const router = require("express").Router();
const { asyncHandler } = require("../middlewares/asyncHandler");

const propertyController = require("../controllers/property.controller");

const checkUserAuth = require("../middlewares/checkUserAuth");
router.use(asyncHandler(checkUserAuth));

// Create a new Property
router.post("/", asyncHandler(propertyController.create));

// Update a Property with id
router.patch("/:id/sold", asyncHandler(propertyController.sell));

// Retrieve all Properties
router.get("/", asyncHandler(propertyController.findAll));

// Retrieve all Properties of a particular type
router.get("/search", asyncHandler(propertyController.findPropByType));

// Retrieve a single Property with id
router.get("/:id", asyncHandler(propertyController.findOne));

// Delete a Property with id
router.delete("/:id", asyncHandler(propertyController.delete));

module.exports = router;
