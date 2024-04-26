const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "User must have an email"],
    validate: [validator.isEmail, "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    select: false,
    min: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match.",
    },
  },
  role:{
    type: String,
    default: "user",
    enum: {
      values: ['user', 'agent', 'admin'], //user, owner and admin..agent?
      message: "{{VALUE}} is not supported"
    },
  },
  photo: String,
  phone: {
    type: Number,
    cast: "{{VALUE}} is not a number",
  },
});

userSchema.pre("save", async function (next) {
  // if password is not changed, dont encrypt
  if (!this.isModified("password")) {
    return next();
  }
  // hash/encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // delete confirm password field before it saves
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  userPassword,
  encryptedPassword
) {
  return await bcrypt.compare(userPassword, encryptedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
