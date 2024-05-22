const express = require("express");
const authController = require("./../controllers/authController");
const sectionController = require("./../controllers/sectionControllers");
const propertyRoutes = require("./../routes/propertyRoutes")

const router = express.Router({ mergeParams: true });

router.use("/:sectionId/property", propertyRoutes);

router
  .route("/")
  .get(sectionController.getAllSections)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    sectionController.createSection
  );

router
  .route("/:id")
  .get(sectionController.getSection)
  .patch(
    authController.protect,
    authController.restrictToAdmin,
    sectionController.updateSection
  )
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    sectionController.deleteSection
  );

module.exports = router;
