const { getFirestoreInstance } = require("../config/firebase");
const db = getFirestoreInstance();

class Bookmark {
  static getBookmarks = async (uid) => {
    try {
      const bookmarkDoc = await db.collection("bookmark").doc(uid).get();
      if (bookmarkDoc.exists) {
        const data = bookmarkDoc.data();
        if (data.bookmark && Array.isArray(data.bookmark)) {
          return data.bookmark;
        }
      }
      return [];
    } catch (error) {
      throw new Error("북마크 데이터를 가지고 오지 못했습니다.");
    }
  };

  static postBookmark = async (uid, bookmark) => {
    try {
      await db.collection("bookmark").doc(uid).set({
        bookmark: bookmark,
      });
    } catch (error) {
      throw new Error(`북마크 업데이트 에러 ${error}`);
    }
  };

  static deleteBookmarksByUserId = async (uid) => {
    const bookmarkRef = db.collection("bookmark").doc(uid);
    await bookmarkRef.delete();
  };
}

module.exports = { Bookmark };
