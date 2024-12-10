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

module.exports = { getBookmark, postBookmark };
