const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../utils/secrets");
const { logger } = require("./logger");
const User = require("../models/user.model");
const { UNAUTHORIZED } = require("../constants/statusCode");

const generate = (id) => jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: "1d" });

const decode = (token, req, res, next) => {
  try {
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      try {
        if (err || !decoded) {
          logger.error(err);
          return res.status(UNAUTHORIZED).json({
            status: "failed",
            message: "User not authorized.",
          });
        }
        User.findById(decoded.id, (err, user) => {
          if (err) {
            logger.error(err);
          }
          if (!user) {
            return res.status(UNAUTHORIZED).json({
              status: "error",
              error: "Invalid token",
              decoded: decoded,
              id: decoded.id,
            });
          }
          req.user = user;
          next();
        });
      } catch (error) {
        logger.error(error);
      }
    });
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = {
  generate,
  decode,
};
