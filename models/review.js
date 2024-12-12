const { Timestamp } = require("firebase-admin/firestore");
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
      const reviewRef = db.collection("reviewNote").doc(uid);
      const result = [];

      await db.runTransaction(async (transaction) => {
        //덮어쓰는 로직이므로 불러오느데 에러가 생기면 원본데이터 손실 => 트랙잭션으로 불러올 때 실패하면 원본데이터 손실 안 가게 하기
        const reviewDoc = await transaction.get(reviewRef);

        const reviews = reviewDoc.exists ? reviewDoc.data().review : [];

        const newReviews = review.map((item) => {
          return {
            qid: item.qid,
            category: item.category,
            updateAt: Timestamp.now(),
          };
        }); //이번에 틀린 문제들

        const mergedReview = [
          ...new Map(
            [...reviews, ...newReviews].map((item) => [item.qid, item])
          ).values(),
        ];
        result.push(...mergedReview);
        await transaction.set(
          reviewRef,
          {
            review: mergedReview,
          },
          { merge: true }
        );
        //받아온 reivews 데이터에 현재 틀린 문제들을 추가하거나 이미 틀렸던 문제이면 timestamp를 바꿈
      });
      return result;
    } catch (error) {
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
