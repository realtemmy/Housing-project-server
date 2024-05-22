const express = require("express");
const authController = require("./../controllers/authController");
const categoryController = require("./../controllers/categoryController");
const sectionRoutes = require("./../routes/sectionRoutes");
const propertyRoutes = require("./../routes/propertyRoutes");

const router = express.Router();

// REroutes to section routes
router.use("/:categoryId/section", sectionRoutes);
router.use("/:categoryId/property", propertyRoutes)

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    categoryController.uploadCategoryPhoto,
    categoryController.uploadToCloudinary,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictToAdmin,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    categoryController.deleteCategory
  );

module.exports = router;
