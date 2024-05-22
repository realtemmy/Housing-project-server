const asyncHandler = require("express-async-handler");
const AppError = require("./../utils/AppError");
const Section = require("./../models/sectionModel");

exports.getAllSections = asyncHandler(async (req, res) => {
  // console.log(req.params);
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  const sections = await Section.find(filter);
  res.status(200).json({
    status: "success",
    data: sections,
  });
});

exports.getSection = asyncHandler(async (req, res, next) => {
  const section = await Section.findById(req.params.id);
  if (!section) {
    return next(new AppError("No document with ID found", 404));
  }
  res.status(200).json({
    status: "success",
    data: section,
  });
});

exports.createSection = asyncHandler(async (req, res) => {
  const newSection = await Section.create(req.body);
  res.status(200).json({
    status: "success",
    data: newSection,
  });
});

exports.updateSection = asyncHandler(async (req, res, next) => {
  const updatedSection = await Section.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSection) {
    return next(new AppError("No document found with ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedSection,
  });
});

exports.deleteSection = asyncHandler(async (req, res, next) => {
  await Section.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// CRUD completed
