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

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateUser = asyncHandler(async (req, res, next) => {
  // UPDATE CLOUDINARY IMAGE
  // Throw error if they try to  update password through this route
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This is not the route for updating password. Use /user/update-password route"
      )
    );
  }
  // this is to update currently logged in user..I don't want to be able to update role as user
  const filteredBody = filterObj(req.body, "name", "email", "phone", "address");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
