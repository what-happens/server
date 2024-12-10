const { query, param } = require("express-validator");

// 회원가입 시 검증할 내용
const quizQueryValidator = [
  query("category")
    .trim()
    .exists()
    .withMessage("카테고리는 필수입니다.")
    .bail()
    .isString()
    .withMessage("category의 데이터 타입은 string입니다."),
  query("limit")
    .trim()
    .exists()
    .withMessage("문제 수는 필수입니다.")
    .bail()
    .isNumeric()
    .withMessage("limit의 데이터 타입은 Number 타입이어야 합니다."),
];

const quizParamValidator = [
  param("qid")
    .trim()
    .exists()
    .withMessage("qid를 포함해주세요")
    .bail()
    .isNumeric()
    .bail("qid의 타입은 Number입니다."),
];

module.exports = { quizQueryValidator, quizParamValidator };
