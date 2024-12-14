const { getFirestoreInstance } = require("../config/firebase");
const db = getFirestoreInstance();

class UserModel {
  constructor(uid, email, name, createdAt, clearStages = [], quizTime = 0) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.userRef = db.collection("users").doc(uid);
    this.quizTime = quizTime;
    this.clearStages = clearStages;
    this.createdAt = createdAt;
  }

  // 유저 생성 메서드
  async createUser() {
    try {
      const userDoc = await this.userRef.get();

      if (userDoc.exists) {
        throw new Error("이미 존재하는 사용자입니다.");
      }

      await this.userRef.set({
        uid: this.uid,
        email: this.email,
        name: this.name,
        createdAt: this.createdAt,
        quizTime: this.quizTime,
        clearStages: this.clearStages,
      });

      console.log(`사용자 정보가 Firestore에 저장됨: ${this.uid}`);
    } catch (error) {
      throw new Error(`Firestore 저장 중 오류 발생: ${error.message}`);
    }
  }

  // 특정 유저 데이터를 가져오는 정적 메서드
  static async getUserData(uid) {
    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data();
      return userData;
    } catch (error) {
      throw new Error("유저 정보를 가져오는 데 실패했습니다.");
    }
  }

  // 퀴즈 시간 업데이트 메서드
  static async updateQuizTimes(uid) {
    try {
      const userData = await this.getUserData(uid);
      const quizTime = userData.quizTime || 0;

      const userRef = db.collection("users").doc(uid);

      await userRef.set(
        {
          quizTime: quizTime + 1,
        },
        { merge: true }
      );

      return quizTime + 1;
    } catch (error) {
      throw new Error("유저 정보를 업데이트하는 데 실패했습니다.");
    }
  }

  // 유저 삭제 메서드
  static async deleteUser(uid) {
    const userRef = db.collection("users").doc(uid);
    await userRef.delete();
  }
}

module.exports = { UserModel };
