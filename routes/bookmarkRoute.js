const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getBookmark,
  postBookmark,
} = require("../controllers/bookmarkController");
const { bookmarkValidator } = require("../validators/bookmarkValidator");
const router = express.Router();

router.get("/", authenticate, getBookmark);

module.exports = router;
