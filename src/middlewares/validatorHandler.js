const { BAD_REQUEST } = require("../constants/statusCode");
const validatorHandler = (req, res, next, schema) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(BAD_REQUEST).json({
      status: "error",
      message: error.details[0].message.replace(/[^a-zA-Z0-9]/g, " "),
    });
  }
  next();
};

module.exports = validatorHandler;
