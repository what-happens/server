const admin = require("firebase-admin");
const { getIdCookieOptions } = require("../config/cookie");

const authenticate = async (req, res, next) => {
  const idToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!idToken) {
    return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
  }

  try {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken;
    } catch (error) {
      //id 토큰이 유효하지 않으면
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        }
      );

      const json = await response.json();
      const newIdToken = json.id_token;
      const uid = json.user_id;
      res.cookie("accessToken", newIdToken, getIdCookieOptions);
      req.user = { uid: uid };
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "다시 로그인해주세요" });
  }
};

module.exports = authenticate;
