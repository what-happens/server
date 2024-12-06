const { getFirestoreInstance } = require("../config/firebase");
const { selectArrayElement } = require("../utils/selectArrayElement");
const db = getFirestoreInstance();

class QuizModal {
  static async getRandomQuiz(category, limit) {
    try {
      const categoryQuery = db.collection("category").doc(category);
      const categorySnapshot = await categoryQuery.get(); //category 컬렉션에서 category 변수의 값과 일치하는 doc를 불러온다.
      const qIds = categorySnapshot.data().qid;
      const selectedQids = selectArrayElement(qIds, limit);
      console.log("qIds", qIds, "selectedQids", selectedQids);
      let quizQuery = db
        .collection("quiz")
        .where("category", "==", category)
        .where("id", "in", selectedQids);
      const quizSnapshot = await quizQuery.get();
      if (quizSnapshot.empty) {
        return [];
      }
      const quizzes = quizSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return quizzes;
      //스냅샷 데이터를 배열로 변환
    } catch (error) {
      throw new Error(`퀴즈를 가져오지 못했습니다: ${error.message}`);
    }
  }
}

module.exports = QuizModal;
