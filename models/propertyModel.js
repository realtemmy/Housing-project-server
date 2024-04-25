const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
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
  images: [
    {
      text: String,
      imageUrl: String,
    },
  ],
  description: [String],
  summary: String,
  location: [],
});

const Property = mongoose.model("Property", propertySchema);
