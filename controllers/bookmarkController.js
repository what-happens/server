const { validationResult } = require("express-validator");
const { Bookmark } = require("../models/bookmark");
const { Timestamp } = require("firebase-admin/firestore");

const getBookmark = async (req, res) => {
  const { uid } = req.user;
  try {
    const bookmarks = await Bookmark.getBookmarks(uid);
    res.status(200).json({ bookmark: bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postBookmark = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bookmark } = req.body;
  const { uid } = req.user;

  try {
    const exisingBookmark = await Bookmark.getBookmarks(uid);
    const deleteBookmarkSet = new Set(
      bookmark
        .filter((item) => item.action === "delete")
        .map((item) => item.qid)
    );

    const filteredBookmarks = exisingBookmark.filter(
      (bookmark) => !deleteBookmarkSet.has(bookmark.qid)
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

    const storedBookmark = [
      ...new Map(
        [...filteredBookmarks, ...newBookmarks].map((item) => [
          item.qid,
          { qid: item.qid, category: item.category, updateAt: item.updateAt },
        ])
      ).values(),
    ];

    console.log(storedBookmark);
    await Bookmark.postBookmark(uid, storedBookmark);
    return res
      .status(200)
      .json({ message: "북마크 업데이트 성공", bookmark: storedBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBookmark, postBookmark };
