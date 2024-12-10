const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { getFirestoreInstance } = require("../config/firebase");
const { changeBookmarkFormat } = require("../utils/changeformat");
const db = getFirestoreInstance();
class Bookmark {
  static getBookmarks = async (uid) => {
    try {
      const bookmarkDoc = await db.collection("bookmark").doc(uid).get();
      if (bookmarkDoc.exists) {
        const data = bookmarkDoc.data();
        const bookmarkData = changeBookmarkFormat(data);
        return bookmarkData;
      }
    } catch (error) {
      throw new Error("북마크 데이터를 가지고 오지 못했습니다.");
    }
  };
}

module.exports = { Bookmark };
