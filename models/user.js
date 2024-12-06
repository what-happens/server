const { getFirestoreInstance } = require("../config/firebase");
const db = getFirestoreInstance();

class UserModel {
  constructor(uid, email, name, createdAt) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.userRef = db.collection("users").doc(this.uid);
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
      });

      console.log(`사용자 정보가 firestore에 저장 : ${this.uid}`);
    } catch (error) {
      throw new Error(`Firestore 저장 중 오류가 발생했습니다.`);
    }
  }
}

module.exports = UserModel;
