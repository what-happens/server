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
  static postBookmark = async (uid, qid) => {
    try {
      const bookmarkRef = db.collection("bookmark").doc(uid);
      const bookmarkDoc = await bookmarkRef.get();

      if (bookmarkDoc.exists) {
        const bookmarks = bookmarkDoc.data().bookmark || [];
        const isAlreadyBookmarked = bookmarks.some(
          (bookmark) => bookmark.qid === parseInt(qid)
        );

        if (isAlreadyBookmarked) {
          //이미 존재하는 qid라면
          await bookmarkRef.update({
            bookmark: FieldValue.arrayRemove(
              bookmarks.find((bookmark) => bookmark.qid === parseInt(qid))
            ),
          });
        } else {
          //북마크가 없는 상태라면
          await bookmarkRef.set(
            {
              bookmark: FieldValue.arrayUnion({
                qid: parseInt(qid),
                updateAt: Timestamp.now(),
              }),
            },
            { merge: true }
          );
        }
      }
    } catch (error) {
      throw new Error(`북마크 업데이트 에러 ${error}`);
    }
  };
}

module.exports = { Bookmark };
