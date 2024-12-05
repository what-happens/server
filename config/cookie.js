const cookieConfig = {
  development: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
  production: {
    httpOnly: true,
    secure: true, // HTTPS 필수
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

module.exports = {
  getIdCookieOptions: {
    ...cookieConfig["development"],
  },
};
