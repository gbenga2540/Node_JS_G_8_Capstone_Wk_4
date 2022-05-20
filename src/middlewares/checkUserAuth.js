const { UNAUTHORIZED } = require("../constants/statusCode");
const { decode } = require("../utils/token");

const checkUserAuth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(UNAUTHORIZED).json({
      status: "error",
      error: "Unauthorized: No token",
    });
  }
  decode(token, req, res, next);
};

module.exports = checkUserAuth;
