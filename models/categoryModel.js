const mongoose = require("mongoose");
const slugify = require("slugify");

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
  slug: String,
});

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
