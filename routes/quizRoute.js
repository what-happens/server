const express = require("express");
const { quizQueryValidator } = require("../validators/quizValidator");
const { getQuiz } = require("../controllers/quizController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticate, quizQueryValidator, getQuiz);

module.exports = router;
