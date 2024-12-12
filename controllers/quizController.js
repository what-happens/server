const { validationResult } = require("express-validator");
const QuizModal = require("../models/quiz");
const { UserModel } = require("../models/user");
const { updateBookmark } = require("../services/bookmarkService");
const { saveReview } = require("../services/reviewService");
const getQuizzes = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req의 쿼리에서 error가 있을 경우
    return res.status(400).json({ errors: errors.array() });
  }

  const { category, limit } = req.query;
  const { uid } = req.user;
  try {
    const randomQuiz = await QuizModal.getRandomQuiz(category, limit, uid);

    res.status(200).json({ quiz: randomQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuiz = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { qid } = req.params;

  try {
    const selectedQuiz = await QuizModal.getSelectQuiz(qid);
    res.status(200).json({ quiz: selectedQuiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const storeQuizResult = async (req, res) => {
  const { uid } = req.user;
  const { bookmark, review } = req.body;
  const resultBookmark = await updateBookmark(uid, bookmark);
  const resultReview = await saveReview(uid, review);
  const quizTime = await UserModel.updateQuizTimes(uid);
  res.status(200).json({
    message: "퀴즈 결과를 성공적으로 저장했습니다.",
    bookmark: resultBookmark,
    review: resultReview,
    quizTime: quizTime,
  });
};
module.exports = { getQuizzes, getQuiz, storeQuizResult };
