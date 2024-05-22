const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const reviewRoutes = require("./../routes/reviewRoutes");

const router = express.Router();

router.use("/:userId/review", reviewRoutes);

router.post("/login", authController.login);
router.post("/signup", authController.signup);

router.get('/me', authController.protect, userController.getCurrentUser);
router.post('/update-password', authController.protect, authController.updatePassword)
router.post('/update-user', authController.protect, userController.updateUser)

router.get("/", authController.protect, userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
