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

      console.log(`사용자 정보가 firestore에 저장 : ${this.uid}`);
    } catch (error) {
      throw new Error(`Firestore 저장 중 오류가 발생했습니다.`);
    }
  }

  static async getUserData(uid) {
    try {
      const userDoc = await db.collection("users").doc(uid).get();
      const userData = userDoc.data();
      return userData;
    } catch (error) {
      throw new Error("유저 정보를 가져오지 못했습니다.");
    }
  }

  static async updateQuizTimes(uid) {
    try {
      const userData = await this.getUserData(uid);
      const quizTime = userData.quizTime || 0;

      const userRef = db.collection("users").doc(uid);

      userRef.set(
        {
          quizTime: quizTime + 1,
        },
        { merge: true }
      );

      return quizTime + 1;
    } catch (error) {
      throw new Error("유저 정보를 업데이트 하지 못했습니다.");
    }
  }

  static async deleteUser(uid) {
    const userRef = db.collection("users").doc(uid);
    await userRef.delete();
  }
}

module.exports = { UserModel };
