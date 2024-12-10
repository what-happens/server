const { runTransaction, Timestamp } = require("firebase-admin/firestore");
const { getFirestoreInstance } = require("../config/firebase");
const db = getFirestoreInstance();

class Review {
  static postReview = async (uid, review) => {
    try {
      const reviewRef = db.collection("reviewNote").doc(uid);
      const result = [];

      await db.runTransaction(async (transaction) => {
        //덮어쓰는 로직이므로 불러오느데 에러가 생기면 원본데이터 손실 => 트랙잭션으로 불러올 때 실패하면 원본데이터 손실 안 가게 하기
        const reviewDoc = await transaction.get(reviewRef);

        const reviews = reviewDoc.data().review || []; //review 데이터 받아오기

        const newReviews = review.map((qid) => {
          return { qid: qid, updateAt: Timestamp.now() };
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
    } catch (error) {}
  };
}

module.exports = { Review };
