const mongoose = require("mongoose");
const slugify = require("slugify");

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Section must have a name"],
    unique: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    required: [true, "A section must belong to a category"],
  },
  slug: String,
});

sectionSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
