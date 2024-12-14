const { validationResult } = require("express-validator");
const admin = require("firebase-admin");
const {
  getIdCookieOptions,
  getRefreshTokenCookieOptions,
} = require("../config/cookie");
const { UserModel } = require("../models/user");
const { Bookmark } = require("../models/bookmark");
const { Review } = require("../models/review");

// 유저 생성 컨트롤러
const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // 요청에서 검증 오류가 발생한 경우
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body; // 클라이언트에서 입력한 유저 정보

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;
    const createdAt = admin.firestore.Timestamp.now();

    const user = new UserModel(uid, email, name, createdAt);
    await user.createUser();

    res.status(201).json({
      message: "유저 생성 성공",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "유저 생성 실패", error: error.message });
  }
};

// 유저 로그인 컨트롤러
const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await result.json();

    if (!result.ok) {
      throw {
        status: 400,
        message: "로그인 실패. 이메일 또는 비밀번호를 확인하세요.",
      };
    }

    res.cookie("refreshToken", data.refreshToken, getRefreshTokenCookieOptions);
    res.cookie("accessToken", data.idToken, getIdCookieOptions);

    res.status(200).send({
      message: "로그인 성공",
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    }
    res.status(500).send({
      message: "서버 에러",
      error: error.message,
    });
  }
};

// 로그아웃 컨트롤러
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({
      message: "로그아웃 성공",
      redirectUrl: "/",
    });
  } catch (error) {
    res.status(500).json({ message: "로그아웃 실패" });
  }
};

// 유저 삭제 컨트롤러
const deleteUser = async (req, res) => {
  const { uid } = req.user;

  try {
    await UserModel.deleteUser(uid);
    await Bookmark.deleteBookmarksByUserId(uid);
    await Review.deleteReviewNotesByUserId(uid);
    await admin.auth().deleteUser(uid);

    res.status(200).json({ message: "회원 탈퇴 성공" });
  } catch (error) {
    res.status(500).json({ message: "회원 탈퇴 실패" });
  }
};

module.exports = { createUser, loginUser, logoutUser, deleteUser };
