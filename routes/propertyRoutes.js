const express = require("express");
const authController = require("./../controllers/authController");
const propertyController = require("./../controllers/propertyController");

const router = express.Router({ mergeParams: true });

// On page load, get properties near or close to the user's location;
// lng, lat, distance

// router.route("/")
router
  .route("/")
  .get(propertyController.getAllProperties)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    propertyController.uploadImages,
    propertyController.uploadToCloudinary,
    propertyController.createProperty
  );

router
  .route("/:id")
  .get(propertyController.getProperty)
  .patch(
    authController.protect,
    authController.restrictToAdmin,
    propertyController.updateProperty
  )
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    propertyController.deleteProperty
  );

module.exports = router;
