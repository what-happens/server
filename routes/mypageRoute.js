const express = require("express");

const { getMypage } = require("../controllers/mypageController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, getMypage);

module.exports = router;
