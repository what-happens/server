const { body } = require("express-validator");

const bookmarkValidator = [
  body("bookmark").isArray().withMessage("review는 배열 형태이어야 합니다"),
];

module.exports = { bookmarkValidator };
