const { getFirestoreInstance } = require("../config/firebase");

const db = getFirestoreInstance();
class Stage {
  static async updateUserStageProgress(uid, clearStages) {
    return db.collection("users").doc(uid).update({
      clearStages,
    });
  }

  static async getUserStageProgress(uid) {
    const userDoc = await db.collection("users").doc(uid).get();
    return userDoc.data().clearStages;
  }
}

module.exports = { Stage };
