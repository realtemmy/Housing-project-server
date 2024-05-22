const asyncHandler = require("express-async-handler");
const { promisify } = require("util");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");
// const Email = require("./../utils/email");

const createSendToken = (user, statusCode, res) => {
  // create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_DURATION,
  });

  const cookieOptions = {
    expiresIn:
      new Date() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // check if account exists
  // console.log("User: ", req.body);
  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("No user with email found", 404));
  }
  // compare with hashed password in db
  const matches = await user.comparePasswords(password, user.password);
  if (!matches) {
    return next(new AppError("Email or password is incorrect", 400));
  }

  createSendToken(user, 200, res);
});

exports.signup = asyncHandler(async (req, res) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });
  // await new Email(user, "https://google.com").sendWelcome();
  createSendToken(user, 201, res);
});

// protect middleware
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) get the jwt token form bearers authentication
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You're not logged in. Login to get access", 401));
  }
  // 2) Decode an get the users id
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  // 3) Get user from decoded jwt id
  const user = await User.findById(decode.id);
  if (!user) {
    return next(
      new AppError(
        "The account belonging to this token does not exist. Please login again"
      )
    );
  }
  // 3) save users id
  req.user = user;
  next();
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // To update password means you remember your prev password, and you just wana change am.
  // 1) Get new password to be
  const { newPassword, confirmNewPassword, currentPassword } = req.body;
  // 2) Get current password saved in DB(hashed) of logged in user
  const user = await User.findById(req.user.id).select("+password");
  // 3) Compare prev password with hashed one if they match
  if (!user.comparePasswords(currentPassword, user.password)) {
    return next(new AppError("Incorrect password!", 401));
  }
  // 4) save the current user with the new password
  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  createSendToken(user, 200, res);
});

exports.restrictToAdmin = asyncHandler(async (req, res, next) => {
  // if user role is not admin, return error
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have access to this route!", 401));
  }

  next();
});
