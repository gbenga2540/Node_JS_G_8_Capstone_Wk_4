const User = require("../models/user.model");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken } = require("../utils/token");

exports.signup = (req, res) => {
  const { first_name, last_name, email, phone, address, is_admin, password } =
    req.body;
  const hashedPassword = hashPassword(password.trim());

  const user = new User(
    email.trim(),
    first_name.trim(),
    last_name.trim(),
    hashedPassword,
    phone.trim(),
    address.trim(),
    is_admin
  );

  User.create(user, (err, data) => {
    if (err) {
      res.status(500).json({
        status: "error",
        error: err.message,
      });
    } else {
      const token = generateToken(data.id);
      res.status(201).json({
        status: "success",
        data: {
          token,
          id: data.id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });
    }
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email.trim(), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).json({
          status: "error",
          error: `User with email ${email} was not found`,
        });
        return;
      }
      res.status(500).json({
        status: "error",
        error: err.message,
      });
      return;
    }
    if (data) {
      if (comparePassword(password.trim(), data.password)) {
        const token = generateToken(data.id);
        res.status(200).json({
          status: "success",
          data: {
            token,
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
          },
        });
        return;
      }
      res.status(401).json({
        status: "error",
        error: "Incorrect password",
      });
    }
  });
};
