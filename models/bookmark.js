const { FieldValue, Timestamp } = require("firebase-admin/firestore");
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
      const bookmarkRef = db.collection("bookmark").doc(uid);
      const result = [];

      await db.runTransaction(async (transaction) => {
        //덮어쓰는 로직이므로 불러오느데 에러가 생기면 원본데이터 손실 => 트랙잭션으로 불러올 때 실패하면 원본데이터 손실 안 가게 하기
        const bookmarkDoc = await bookmarkRef.get();
        const bookmarks = bookmarkDoc.exists ? bookmarkDoc.data().bookmark : [];

        const deletebookmarkSet = new Set(
          bookmark.map((item) => {
            if (item.action === "delete") {
              return item.qid;
            }
          })
        );
        const filteredBookmarks = bookmarks.filter(
          (item) => !deletebookmarkSet.has(item.qid)
        );

        const newBookmarks = bookmark
          .filter((item) => item.action === "add")
          .map((item) => {
            return {
              qid: item.qid,
              category: item.category,
              updateAt: Timestamp.now(),
            };
          });

        const mergedBookmark = [
          ...new Map(
            [...filteredBookmarks, ...newBookmarks].map((item) => [
              item.qid,
              {
                qid: item.qid,
                category: item.category,
                updateAt: item.updateAt,
              },
            ])
          ).values(),
        ];

        result.push(...mergedBookmark);

        await transaction.set(
          bookmarkRef,
          {
            bookmark: mergedBookmark,
          },
          { merge: true }
        );
      });
      return result;
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
