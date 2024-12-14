const admin = require("firebase-admin");
const { getIdCookieOptions } = require("../config/cookie");

/**
 * 사용자를 인증하는 미들웨어.
 * 1. Firebase Admin SDK를 사용하여 accessToken을 검증합니다.
 * 2. accessToken이 만료된 경우, refreshToken을 사용해 새로운 accessToken을 가져옵니다.
 * 3. 새로운 accessToken을 쿠키에 저장하고, 사용자 ID를 `req.user` 객체에 추가합니다.
 *
 * 요구되는 쿠키:
 * - accessToken: 현재의 액세스 토큰 (만료되었을 수 있음).
 * - refreshToken: 새로운 액세스 토큰을 얻기 위한 리프레시 토큰.
 *
 * 성공 시:
 * - `req.user`에 사용자 ID가 포함된 상태로 `next()` 호출.
 *
 * 실패 시:
 * - 적절한 에러 메시지와 함께 401 상태를 반환합니다.
 */

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
