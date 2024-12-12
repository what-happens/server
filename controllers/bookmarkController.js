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

  const { bookmark } = req.body;
  const { uid } = req.user;

  try {
    const storedBookmark = await Bookmark.postBookmark(uid, bookmark);
    res
      .status(200)
      .json({ message: "북마크 업데이트 성공", bookmark: storedBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getBookmark, postBookmark };
