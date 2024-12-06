const admin = require("firebase-admin");

const authenticate = async (req, res, next) => {
  const idToken = req.cookies.accessToken;

  if (!idToken) {
    return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authenticate;
