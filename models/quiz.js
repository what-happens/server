const { getFirestoreInstance } = require("../config/firebase");
const { shffleArray } = require("../utils/shffleArray");
const db = getFirestoreInstance();

class QuizModal {
  static async getRandomQuiz(category, limit) {
    try {
      const query = db.collection("quiz").where("category", "==", category);
      const snapshot = await query.get(); // 현재 쿼리에 맞는 문서들을 db에서 불러옴
      if (snapshot.empty) {
        return [];
      }
      //스냅샷 데이터를 배열로 변환
      const quizzes = snapshot.docs.map((doc) => ({
        id: doc.qid,
        ...doc.data(),
      }));
      const shffledQuizzes = shffleArray(quizzes).slice(0, limit);
      return shffledQuizzes;
    } catch (error) {
      throw new Error(`퀴즈를 가져오지 못했습니다: ${error.message}`);
    }
  }
}

module.exports = QuizModal;
