const express = require("express");
const { validateCreateUser } = require("../validators/userValidator");
const { createUser } = require("../controllers/userController");

const router = express.Router();

//router.get('/', getAllusers);

router.post("/", validateCreateUser, createUser);

module.exports = router;
