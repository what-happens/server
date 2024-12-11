const express = require("express");
const {
  quizQueryValidator,
  quizParamValidator,
} = require("../validators/quizValidator");
const {
  getQuiz,
  getQuizzes,
  storeQuizResult,
} = require("../controllers/quizController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticate, quizQueryValidator, getQuizzes);

router.get("/:qid", authenticate, quizParamValidator, getQuiz);

router.post("/results", authenticate, storeQuizResult);
module.exports = router;
