const mongoose = require("mongoose");
const Property = require("./../models/propertyModel");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A review must belong to a user"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, "Review is cannot be empty"],
    },
    property: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A review must belong to a property"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate("user");
  next();
});

reviewSchema.statics.calcAverageRatings = async function (propId) {
  const stats = await this.aggregate([
    {
      $match: { property: propId },
    },
    {
      $group: {
        _id: "$property",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propId, {
      ratingsQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    await Property.findByIdAndUpdate(propId, {
      ratingsQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

// pre save or validate, check if both message and rating are empty

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
