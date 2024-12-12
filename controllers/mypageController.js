const { Bookmark } = require("../models/bookmark");
const { UserModel } = require("../models/user");

const getMypage = async (req, res) => {
  const { uid } = req.user;

  try {
    const userData = await UserModel.getUserData(uid);
    const bookmark = await Bookmark.getBookmarks(uid);
    userData.bookmarkNum = bookmark.length;
    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getMypage };
