const { Timestamp } = require("firebase-admin/firestore");
const { Review } = require("../models/review");

const saveReview = async (uid, review) => {
  try {
    const existingReview = await Review.getReview(uid);

    const newReviews = review.map((item) => {
      return {
        qid: item.qid,
        category: item.category,
        updateAt: Timestamp.now(),
      };
    });

    const saveReview = [
      ...new Map(
        [...existingReview, ...newReviews].map((item) => [item.qid, item])
      ).values(),
    ];

    await Review.postReview(uid, saveReview);
    return saveReview;
  } catch (error) {
    throw new Error(`오답문제 저장 에러: ${error.message}`);
  }
};

module.exports = { saveReview };
