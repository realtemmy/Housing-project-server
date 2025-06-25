const multer = require("multer");
const asyncHandler = require("express-async-handler");
const Property = require("./../models/propertyModel");
const AppError = require("./../utils/AppError");
const cloudinary = require("./../utils/cloudinary");

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

exports.getAllProperties = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  if (req.params.sectionId) filter = { section: req.params.sectionId };
  const props = await Property.find(filter);
  res.status(200).json({
    status: "success",
    length: props.length,
    data: props,
  });
});

exports.getPropsByDistance = asyncHandler(async (req, res) => {
  let { distance, lnglat } = req.params;
  lnglat = lnglat.split(",");
  const lng = lnglat[0];
  const lat = lnglat[1];
  const props = await Property.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: distance * 1000,
      },
    },
  }).sort({ distance: 1 });
  res.status(200).json({
    status: "success",
    data: {
      props,
    },
  });
});

exports.uploadImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

exports.uploadToCloudinary = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files) {
    return next(new AppError("No file uploaded", 401));
  }
  const image = await new cloudinary(
    req,
    "property",
    1200,
    1000,
    "image"
  ).uploadMultiple();
  const response = new cloudinary(req, "property", 1200, 1000, "images");
  const images = await response.uploadMultiple();

  req.body.images = images;
  req.body.image = image[0];
  next();
});

exports.createProperty = asyncHandler(async (req, res) => {
  // add images
  // console.log("Req body: ", req.body);
  console.log(req.body.latlng.split(",").map(parseFloat));
  const newProp = await Property.create({
    name: req.body.name,
    address: req.body.address,
    ownerId: req.user.id,
    image: req.body.image,
    description: req.body.description,
    section: req.body.section,
    category: req.body.category,
    summary: req.body.summary,
    images: req.body.images.map((image, index) => ({
      imageUrl: image,
      text: req.body.text[index],
    })),
    location: {
      coordinates: req.body.latlng.split(",").map(parseFloat),
    },
  });
  res.status(201).json({
    status: "success",
    data: newProp,
  });
});

exports.getProperty = asyncHandler(async (req, res, next) => {
  const prop = await Property.findById(req.params.id);
  if (!prop) {
    return next(new AppError("No document with Id found", 404));
  }

  res.status(200).json({
    status: "success",
    data: prop,
  });
});

exports.updateProperty = asyncHandler(async (req, res, next) => {
  // should not be able to update ownerId, plus location?
  const updatedProp = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProp) {
    return next(new AppError("No document with ID found", 404));
  }

  res.status(200).json({
    stataus: "success",
    data: updatedProp,
  });
});

exports.deleteProperty = asyncHandler(async (req, res) => {
  // firstly, delete cloudinary images
  await Property.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// belt raise sword spell include develop acquire risk debate index little thought
