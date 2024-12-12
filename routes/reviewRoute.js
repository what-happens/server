const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getReview,
  postReview,
  deleteReview,
} = require("../controllers/reviewController");
const { validateReview } = require("../validators/reviewValidator");
const router = express.Router();

router.get("/", authenticate, getReview);
router.delete("/", authenticate, validateReview, deleteReview);
router.post("/", authenticate, validateReview, postReview);

module.exports = router;
