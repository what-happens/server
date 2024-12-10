const express = require("express");
const {
  quizQueryValidator,
  quizParamValidator,
} = require("../validators/quizValidator");
const { getQuiz, getQuizzes } = require("../controllers/quizController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticate, quizQueryValidator, getQuizzes);

router.get("/:qid", authenticate, quizParamValidator, getQuiz);

module.exports = router;
