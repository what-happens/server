const express = require("express");

const {
  updateClearStage,
  getClearStage,
} = require("../controllers/stageController");
const authenticate = require("../middleware/authMiddleware");
const { stageParamValidator } = require("../validators/stageValidator");

const router = express.Router();

router.put(
  "/clear/:stageId/:levelId",
  authenticate,
  stageParamValidator,
  updateClearStage
);

router.get("/clear", authenticate, getClearStage);

module.exports = router;
