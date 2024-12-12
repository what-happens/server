const { body } = require("express-validator");

// 로그인 시 검증할 내용
const validateReview = [
  body("review").isArray().withMessage("review는 배열 형태이어야 합니다"),
];

module.exports = { validateReview };
