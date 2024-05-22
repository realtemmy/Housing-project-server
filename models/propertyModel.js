const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property must have a name"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "property must have an address"],
    },
    ownerId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Property owner not set"],
    },
    image: {
      type: String,
      required: [true, "Property should have an image"],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be greater than 1"],
      max: [5, "rating must be less than 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    images: [
      {
        text: String,
        imageUrl: String,
      },
    ],
    description: [String],
    summary: String,
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    section: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Property must belong to a section"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Property must belong to a category"],
    },
    amenities: [String],
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

propertySchema.index({ location: "2dsphere" });

// Virtual Properties (Populating review with Property)
propertySchema.virtual("reviews", {
  ref: "Review",
  foreignField: "property",
  localField: "_id",
});

propertySchema.static(
  "findByDistance",
  function (lng, lat, distance, unit = "km") {
    const unitValue = unit === "km" ? 1000 : 1609.3;
    this.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          maxDistance: distance * unitValue,
          distanceField: "distance",
          distanceMultiplier: 1 / unitValue,
        },
      },
    ]);
  }
);

propertySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
