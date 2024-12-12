const { getFirestoreInstance } = require("../config/firebase");
const { selectArrayElement } = require("../utils/selectArrayElement");
const { Bookmark } = require("./bookmark");
const db = getFirestoreInstance();

class QuizModal {
  static async getRandomQuiz(category, limit, uid) {
    try {
      const categoryQuery = db.collection("category").doc(category);
      const categorySnapshot = await categoryQuery.get(); //category 컬렉션에서 category 변수의 값과 일치하는 doc를 불러온다.
      const bookmark = await Bookmark.getBookmarks(uid);
      const bookmarkSet = new Set(...[bookmark.map((item) => item.qid)]);
      const qIds = categorySnapshot.data().qid;
      const selectedQids = selectArrayElement(qIds, limit);
      const CHUNK_SIZE = 10;
      const quizzes = [];
      for (let i = 0; i < selectedQids.length; i += CHUNK_SIZE) {
        const chunk = selectedQids.slice(i, i + CHUNK_SIZE);

        // Firestore 쿼리에서 'in' 연산자 사용
        const querySnapshot = await db
          .collection("quiz")
          .where("category", "==", category)
          .where("id", "in", chunk)
          .get();

        querySnapshot.forEach((doc) => {
          quizzes.push(doc.data());
        });
      }
      return quizzes.map((item) => {
        if (bookmarkSet.has(item.id)) {
          return { ...item, ...{ isBookmark: true } };
        }
        return { ...item, ...{ isBookmark: false } };
      });
    } catch (error) {
      throw new Error(`퀴즈를 가져오지 못했습니다: ${error.message}`);
    }
  }

  static async getSelectQuiz(qid) {
    const id = parseInt(qid) + 1;
    try {
      const quizDoc = await db.collection("quiz").doc(`Q${id}`).get(); //qid로 값을 갖고옴
      if (quizDoc.exists) {
        return quizDoc.data();
      }
    } catch (error) {
      throw new Error(`퀴즈를 가져오지 못했습니다: ${error.message}`);
    }
  }
}

module.exports = QuizModal;
