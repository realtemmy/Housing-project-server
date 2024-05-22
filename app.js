const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors({ origin: "*" }));
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/section", sectionRoutes);
app.use("/api/v1/property", propertyRoutes);
app.use("/api/v1/review", reviewRoutes);

// All undefined routes
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
