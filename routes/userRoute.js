const express = require("express");
const {
  validateCreateUser,
  validateLogin,
} = require("../validators/userValidator");
const {
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.post("/signup", validateCreateUser, createUser);
router.post("/logout", authenticate, logoutUser);

module.exports = router;
