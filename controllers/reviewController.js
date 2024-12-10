const { Review } = require("../models/review");

const postReview = async (req, res) => {
  const { uid } = req.user;
  const { review } = req.body;

  try {
    const storedReview = await Review.postReview(uid, review);
    res
      .status(200)
      .json({ message: "성공적으로 저장했습니다", review: storedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getReview, postReview };
