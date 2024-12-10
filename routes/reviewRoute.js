const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { getReview, postReview } = require("../controllers/reviewController");
const { validateReview } = require("../validators/reviewValidator");
const router = express.Router();

router.get("/", authenticate, getReview);

router.post("/", authenticate, validateReview, postReview);

module.exports = router;
