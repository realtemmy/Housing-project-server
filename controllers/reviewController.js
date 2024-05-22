const asyncHandler = require("express-async-handler");
const Review = require("./../models/reviewModel");
const AppError = require("./../utils/AppError");

exports.getAllReviews = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.userId) filter = { user: req.params.userId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.createReview = asyncHandler(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newReview,
    },
  });
});

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = Review.findById(req.params.id);
  if (!review) {
    return next(new AppError("No review with ID found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
exports.updateReview = asyncHandler(async (req, res, next) => {
  const updateReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updateReview,
    },
  });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  //first get the id if the review owner
  const rev = await Review.findById(req.params.id);
  if (!rev) {
    return next(new AppError("Review ID does not exist.", 404));
  }
  if (rev.user !== req.user.id) {
    return next(
      new AppError("Review can only be deleted by the creator of review", 403)
    );
  }
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Should be in users route eg /user/:userId/reviews
// exports.getUserReview = asyncHandler(async(req, res, next) => {
//     const userReviews = await Review.find({ user: req.params.id })
// })
