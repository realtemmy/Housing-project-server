const asyncHandler = require("express-async-handler");
const AppError = require("./../utils/AppError");
const Category = require("./../models/categoryModel");
const cloudinary = require("./../utils/cloudinary");
const multer = require("multer");

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    data: categories,
  });
});

// const uploadFile = new cloudinary();
// exports.uploadImage = uploadFile.uploadFile();


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadCategoryPhoto = upload.single("image");

exports.uploadToCloudinary = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }
  const upload = new cloudinary(req, "category", 400, 400);
  const url = await upload.uploadSingleToCloudinary();
  req.body.image = url
  console.log(url);
  next();
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  const category = await Category.findById(req.params.id);
  console.log(category);
  if (!category) {
    return next(new AppError("No document with ID found", 404));
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  // upload image
  const category = await Category.create(req.body);
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    return next(new AppError("No document with ID found", 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
