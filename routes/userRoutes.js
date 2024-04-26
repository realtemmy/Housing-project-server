const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);

// router.use(authController.protect)

router.get('/me', authController.protect, userController.getCurrentUser);
router.post('/update-password', authController.protect, authController.updatePassword)

router.get("/", authController.protect, userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
