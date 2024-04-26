const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  //   Gets currently logged in user
  const currentUser = await User.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: {
      currentUser,
    },
  });
});
