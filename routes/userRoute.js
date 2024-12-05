const express = require("express");
const {
  validateCreateUser,
  validateLogin,
} = require("../validators/userValidator");
const { createUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/login", validateLogin, loginUser);
router.post("/", validateCreateUser, createUser);

module.exports = router;
