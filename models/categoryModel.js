const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Category must have a name"],
  },
  image: {
    type: String,
    required: [true, "Category should have an image"],
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
