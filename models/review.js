const { getFirestoreInstance } = require("../config/firebase");
const db = getFirestoreInstance();

class Review {
  constructor({ qid, updateAt, isBookmark, isWrong, category }) {
    this.qid = qid;
    this.updateAt = updateAt;
    this.isBookmark = isBookmark;
    this.isWrong = isWrong;
    this.category = category;
  }

  static getReview = async (uid) => {
    try {
      const reviewDoc = await db.collection("reviewNote").doc(uid).get();
      if (reviewDoc.exists) {
        const data = reviewDoc.data();
        if (data.review && Array.isArray(data.review)) {
          return data.review;
        }
      }
      return [];
    } catch (error) {
      throw new Error("복습 노트 데이터를 가지고 오지 못했습니다.");
    }
  };

  //model의 역할에 controller에서 처리할 부분이 보임
  //또한 공통 로직이 존재하므로 함수로 리팩토링을 진행하는게 좋아보임

  static postReview = async (uid, review) => {
    try {
      await db.collection("reviewNote").doc(uid).set({
        review: review,
      });
    } catch (error) {
      console.error(error);
      throw new Error("복습 노트 데이터를 저장하지 못했습니다.");
    }
  };

  static getProcessedData = async ({ bookmarks, reviews }) => {
    const processedData = [];
    const reviewQidSet = new Set(reviews.map((review) => review.qid));
    // 북마크와 리뷰를 비교하여 가공
    bookmarks.forEach((bookmark) => {
      const review = reviewQidSet.has(bookmark.qid);
      const isWrong = review ? true : false;
      reviewQidSet.delete(bookmark.qid); //북마크에 있는 review는 제거
      processedData.push(
        new Review({
          qid: bookmark.qid,
          updateAt: bookmark.updateAt,
          isBookmark: true,
          isWrong: isWrong,
          category: bookmark.category,
        })
      );
    });

    const filteredReview = reviews.filter((review) =>
      reviewQidSet.has(review.qid)
    );
    // 리뷰가 있지만 북마크가 없는 경우도 처리
    filteredReview.forEach((review) => {
      processedData.push(
        new Review({
          qid: review.qid,
          updateAt: review.updateAt,
          isBookmark: false,
          isWrong: true,
          category: review.category,
        })
      );
    });

    return processedData;
  };

  static deleteReviewNotesByUserId = async (uid) => {
    const reviewDoc = await db.collection("reviewNote").doc(uid);
    return reviewDoc.delete();
  };
}

module.exports = { Review };
