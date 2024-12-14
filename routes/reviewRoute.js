const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getReview,
  postReview,
  deleteReview,
} = require("../controllers/reviewController");
const { validateReview } = require("../validators/reviewValidator");
const router = express.Router();
/**
 * @swagger
 * /review:
 *   get:
 *     summary: 사용자의 복습 노트를 조회합니다.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 복습 노트를 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewNote:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qid:
 *                         type: integer
 *                       updateAt:
 *                         type: object
 *                         properties:
 *                           _seconds:
 *                             type: integer
 *                           _nanoseconds:
 *                             type: integer
 *                       isBookmark:
 *                         type: boolean
 *                       isWrong:
 *                         type: boolean
 *                       category:
 *                         type: string
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 복습 노트를 가져오는 데 실패했습니다.
 */
router.get("/", authenticate, getReview);
/**
 * @swagger
 * /review:
 *   post:
 *     summary: 사용자의 복습 노트를 저장합니다.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     qid:
 *                       type: integer
 *                     category:
 *                       type: string
 *     responses:
 *       200:
 *         description: 복습 노트를 성공적으로 저장했습니다. 서버에 저장된 review가 반환됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "복습 노트를 성공적으로 저장했습니다."
 *                 review:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qid:
 *                         type: integer
 *                       category:
 *                         type: string
 *                       updateAt:
 *                         type: object
 *                         properties:
 *                           _seconds:
 *                             type: integer
 *                           _nanoseconds:
 *                             type: integer
 *
 */
router.post("/", authenticate, validateReview, postReview);
/**
 * @swagger
 * /review:
 *   delete:
 *     summary: 사용자의 복습 노트를 삭제합니다.
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     qid:
 *                       type: integer
 *                       description: 복습 노트에서 삭제할 질문의 ID
 *     responses:
 *       200:
 *         description: 복습 노트가 성공적으로 삭제되었습니다. 삭제되고 남은 데이터가 반환됩니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "성공적으로 삭제했습니다"
 *                 review:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qid:
 *                         type: integer
 *                         example: 12
 *                       category:
 *                         type: string
 *                         example: "HTML"
 *                       updateAt:
 *                         type: object
 *                         properties:
 *                           _seconds:
 *                             type: integer
 *                             example: 1734158570
 *                           _nanoseconds:
 *                             type: integer
 *                             example: 1000000
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 복습 노트를 삭제하는 데 실패했습니다.
 */

router.delete("/", authenticate, validateReview, deleteReview);

module.exports = router;
