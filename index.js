const express = require("express");
const router = require("express").Router();
const cors = require("cors");
const morgan = require("morgan");
const db = require("./src/config/db.config");
const PORT = process.env.PORT || 3005;
const app = express();
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes.js");
const propertyRoutes = require("./src/routes/property.routes");
const { httpLogStream } = require("./src/utils/logger");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(morgan("combined", { stream: httpLogStream }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/property", propertyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to SideHustle Node REST API with express." });
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    error: err.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log("Server is online!!!");
});
