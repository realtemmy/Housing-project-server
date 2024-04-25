const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


const app = express();

dotenv.config({ path: "./config.env" });

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/user', userRoutes)



// All undefined routes
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


module.exports = app;

