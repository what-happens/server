const { validationResult } = require("express-validator");
const admin = require("firebase-admin");
const {
  getIdCookieOptions,
  getRefreshTokenCookieOptions,
} = require("../config/cookie");
const { UserModel } = require("../models/user");

const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req에서 에러가 있을 경우
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name } = req.body; //유저의 입력 정보

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    const createdAt = admin.firestore.Timestamp.now();
    //firestore에 저장이 안되면 admin.auth의 작업이 취소되어야 함
    const user = new UserModel(uid, email, name, createdAt);

    await user.createUser();

    res.status(201).json({
      message: "User created",
      userRecord: userRecord,
      fireStore: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error create user", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req에서 에러가 있을 경우
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
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await result.json(); // 응답 데이터 파싱
    // 에러 응답 처리
    if (!result.ok) {
      throw {
        status: 400,
        message: "Login Failed check Email or Password",
      };
    }
    // 응답 처리 수정
    res.cookie("refreshToken", data.refreshToken, getRefreshTokenCookieOptions);
    res.cookie("accessToken", data.idToken, getIdCookieOptions);

    res.status(200).send({
      message: "Success Login",
    });
  } catch (error) {
    if (error.status && error.message) {
      return res.status(error.status).send({
        message: error.message,
        error: error.error,
      });
    }
    // 일반 서버 에러 처리
    res.status(500).send({
      message: "Server Error",
      error: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  const { idToken } = req.cookies.accessToken;
  try {
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: { idToken },
      }
    );

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json({
      status: "success",
      message: "로그아웃에 성공했습니다.",
      redirectUrl: "/",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "로그아웃에 실패했습니다.",
    });
  }
};
module.exports = { createUser, loginUser, logoutUser };
