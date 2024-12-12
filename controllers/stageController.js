const { validationResult } = require("express-validator");
const { Stage } = require("../models/stage");

const updateClearStage = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req의 쿼리에서 error가 있을 경우
    return res.status(400).json({ errors: errors.array() });
  }

  const { stageId, levelId } = {
    stageId: Number(req.params.stageId),
    levelId: Number(req.params.levelId),
  };
  const { uid } = req.user;
  try {
    const clearStageInfo = await Stage.getUserStageProgress(uid);

    console.log(clearStageInfo);
    const stageIdx = clearStageInfo.findIndex(
      (stage) => stage.stage_id === stageId
    );

    if (stageIdx > -1) {
      const levels = clearStageInfo[stageIdx].levels;
      if (!levels.includes(levelId)) {
        levels.push(levelId);
        clearStageInfo[stageIdx].levels = levels;
      }
    } else {
      clearStageInfo.push({ stage_id: stageId, levels: [levelId] });
    }

    await Stage.updateUserStageProgress(uid, clearStageInfo);

    return res.status(200).json({
      clearStage: clearStageInfo,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getClearStage = async (req, res) => {
  const { uid } = req.user;
  try {
    const clearStageInfo = await Stage.getUserStageProgress(uid);
    return res.status(200).json({
      clearStage: clearStageInfo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { updateClearStage, getClearStage };
