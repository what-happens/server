const { validationResult } = require("express-validator");
const { Bookmark } = require("../models/bookmark");
const { Timestamp } = require("firebase-admin/firestore");
const { updateBookmark } = require("../services/bookmarkService");

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
    const updatedBookmarks = await updateBookmark(uid, bookmark);
    return res
      .status(200)
      .json({ message: "북마크 업데이트 성공", bookmark: updatedBookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBookmark, postBookmark };
