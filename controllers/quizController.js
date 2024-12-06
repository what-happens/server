const { validationResult } = require("express-validator");
const QuizModal = require("../models/quiz");
const getQuiz = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req의 쿼리에서 error가 있을 경우
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, limit } = req.query;

  try {
    const selectedQuiz = await QuizModal.getRandomQuiz(category, limit);
    res.status(200).json({ quiz: selectedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuiz };
