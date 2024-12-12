const { param } = require("express-validator");

const stageParamValidator = [
  param("stageId")
    .trim()
    .exists()
    .withMessage("stageId를 포함해주세요")
    .bail()
    .isNumeric()
    .withMessage("stageId의 타입은 Number입니다."),
  param("levelId")
    .trim()
    .exists()
    .withMessage("levelId를 포함해주세요")
    .bail()
    .isNumeric()
    .withMessage("levelId의 타입은 Number입니다."),
];

module.exports = { stageParamValidator };
