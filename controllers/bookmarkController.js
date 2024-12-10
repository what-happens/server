const { validationResult } = require("express-validator");
const { Bookmark } = require("../models/bookmark");

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

  const { qid } = req.params;
  const { uid } = req.user;

  try {
    await Bookmark.postBookmark(uid, qid);
    res.status(200).json({ message: "북마크 업데이트 성공" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBookmark, postBookmark };
