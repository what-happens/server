const { param } = require("express-validator");

const bookmarkValidator = [
  param("qid")
    .trim()
    .exists()
    .withMessage("qid를 포함해주세요")
    .bail()
    .isNumeric()
    .bail("qid의 타입은 Number입니다."),
];

module.exports = { bookmarkValidator };
