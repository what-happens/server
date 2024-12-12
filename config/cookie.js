const cookieConfig = {
  development: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000 * 24, // 일
  },
  production: {
    httpOnly: true,
    secure: true, // HTTPS 필수
    sameSite: "strict",
    maxAge: 60 * 60,
  },
};

const refreshTokenCookieConfig = {
  development: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 * 7, //7일
  },
  production: {
    httpOnly: true,
    secure: true, // HTTPS 필수
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 7,
  },
};

module.exports = {
  getIdCookieOptions: {
    ...cookieConfig["development"],
  },
  getRefreshTokenCookieOptions: {
    ...refreshTokenCookieConfig["development"],
  },
};
