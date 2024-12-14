const express = require("express");

const {
  updateClearStage,
  getClearStage,
} = require("../controllers/stageController");
const authenticate = require("../middleware/authMiddleware");
const { stageParamValidator } = require("../validators/stageValidator");

const router = express.Router();
/**
 * @swagger
 * /clear/{stageId}/{levelId}:
 *   put:
 *     summary: "사용자가 스테이지 클리어 정보를 업데이트합니다."
 *     tags: [Stage]
 *     parameters:
 *       - in: path
 *         name: stageId
 *         required: true
 *         description: 스테이지 ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: levelId
 *         required: true
 *         description: 레벨 ID
 *         schema:
 *           type: integer
 *     security:
 *       - cookieAuth: []  # 쿠키 기반 인증 (accessToken)
 *     responses:
 *       200:
 *         description: 스테이지 클리어 정보가 성공적으로 업데이트되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clearStage:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stage_id:
 *                         type: integer
 *                       levels:
 *                         type: array
 *                         items:
 *                           type: integer
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.put(
  "/clear/:stageId/:levelId",
  authenticate,
  stageParamValidator,
  updateClearStage
);

/**
 * @swagger
 * /clear:
 *   get:
 *     summary: "사용자의 스테이지 클리어 정보를 조회합니다."
 *     tags: [Stage]
 *     security:
 *       - cookieAuth: []  # 쿠키 기반 인증 (accessToken)
 *     responses:
 *       200:
 *         description: 사용자의 스테이지 클리어 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clearStage:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       stage_id:
 *                         type: integer
 *                       levels:
 *                         type: array
 *                         items:
 *                           type: integer
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */
router.get("/clear", authenticate, getClearStage);

module.exports = router;
