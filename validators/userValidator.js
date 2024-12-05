const { body } = require("express-validator");

// 로그인 시 검증할 내용
const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("email 필드를 추가해주세요."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .notEmpty()
    .withMessage("password 필드를 추가해주세요"),
];

// 회원가입 시 검증할 내용
const validateCreateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email 필드를 추가해주세요.")
    .bail()
    .isEmail()
    .withMessage("이메일 형식에 맞게 입력해주세요"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password 필드를 추가해주세요")
    .bail()
    .isLength({ min: 8 })
    .withMessage("패스워드는 최소 8자 이상이어야 합니다."),
  body("name").trim().notEmpty().withMessage("name 필드를 추가해주세요."),
];

module.exports = { validateLogin, validateCreateUser };
