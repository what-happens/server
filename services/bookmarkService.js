const { Bookmark } = require("../models/bookmark");
const { Timestamp } = require("firebase-admin/firestore");

const updateBookmark = async (uid, bookmark) => {
  try {
    const existingBookmarks = await Bookmark.getBookmarks(uid);

    const deleteBookmarkSet = new Set(
      bookmark
        .filter((item) => item.action === "delete")
        .map((item) => item.qid)
    );

    const filteredBookmarks = existingBookmarks.filter(
      (item) => !deleteBookmarkSet.has(item.qid)
    );

    const newBookmarks = bookmark
      .filter((item) => item.action === "add")
      .map((item) => ({
        qid: item.qid,
        category: item.category,
        updateAt: Timestamp.now(),
      }));

    const updatedBookmarks = [
      ...new Map(
        [...filteredBookmarks, ...newBookmarks].map((item) => [
          item.qid,
          { qid: item.qid, category: item.category, updateAt: item.updateAt },
        ])
      ).values(),
    ];

    await Bookmark.postBookmark(uid, updatedBookmarks);
    return updatedBookmarks;
  } catch (error) {
    throw new Error(`북마크 업데이트 에러: ${error.message}`);
  }
};

module.exports = { updateBookmark };
