const { Timestamp } = require("firebase-admin/firestore");
const { Bookmark } = require("../models/bookmark");
const { Review } = require("../models/review");
const { compareTime } = require("../utils/comparisons");

const getReview = async (req, res) => {
  const { uid } = req.user;
  try {
    const reviewData = await Review.getReview(uid);
    const bookmarkData = await Bookmark.getBookmarks(uid);

    const processedData = await Review.getProcessedData({
      bookmarks: bookmarkData,
      reviews: reviewData,
    });

    const sortedData = processedData.sort((a, b) => compareTime(a, b));
    res.status(200).json({ reviewNote: sortedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postReview = async (req, res) => {
  const { uid } = req.user;
  const { review } = req.body;

  try {
    const existingReview = await Review.getReview(uid);

    const newReviews = review.map((item) => {
      return {
        qid: item.qid,
        category: item.category,
        updateAt: Timestamp.now(),
      };
    });

    const mergedReview = [
      ...new Map(
        [...existingReview, ...newReviews].map((item) => [item.qid, item])
      ).values(),
    ];

    await Review.postReview(uid, mergedReview);

    res
      .status(200)
      .json({ message: "성공적으로 저장했습니다", review: mergedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { uid } = req.user;
  const { review } = req.body;

  try {
    const existingReview = await Review.getReview(uid);

    const deleteReviewSet = new Set(...review.map((item) => item.qid));

    const remainReview = existingReview.filter(
      (review) => !deleteReviewSet.has(review.qid)
    );

    await Review.postReview(uid, remainReview);

    res
      .status(200)
      .json({ message: "성공적으로 저장했습니다", review: mergedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReview, postReview, deleteReview };
