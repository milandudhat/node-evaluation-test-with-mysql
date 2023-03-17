const express = require("express");
const userController = require("../../controllers/users/userController");
const validateUser = require("../../middlewares/validate");
const router = express.Router();

// get all users
router.get("/getUser", validateUser, userController.getUser);

// register a user
router.post("/registerUser", userController.registerUser);

// login a user
router.post("/loginUser", userController.loginUser);

// update a userprofile
router.put(
  "/updateUserProfile",
  validateUser,
  userController.updateUserProfile
);

module.exports = router;
