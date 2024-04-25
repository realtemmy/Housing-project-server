// for authentication
const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");

exports.login = asyncHandler(async (req, res, next) => {
  // check if account exists
  // check if password matches the hashedpassword in db
});

exports.signup = asyncHandler(async (req, res) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  console.log(user);
  res.status(201).json({
    status: "success",
    data: user,
  });
});
