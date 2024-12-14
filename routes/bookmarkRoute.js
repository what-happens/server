const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const {
  getBookmark,
  postBookmark,
} = require("../controllers/bookmarkController");
const { bookmarkValidator } = require("../validators/bookmarkValidator");
const router = express.Router();
/**
 * @swagger
 * /bookmark:
 *   get:
 *     summary: 사용자의 북마크를 조회합니다.
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 북마크를 성공적으로 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmark:
 *                   type: array
 *                   items:
 *                     type: string
 *
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 북마크를 업데이트하는 데 실패했습니다.
 */
router.get("/", authenticate, getBookmark);
/**
 * @swagger
 * /bookmark:
 *   post:
 *     summary: 사용자의 북마크를 업데이트합니다.
 *     tags: [Bookmarks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookmark:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     qid:
 *                       type: integer
 *                       description: 퀴즈 ID
 *                     category:
 *                       type: string
 *                       description: 퀴즈 카테고리
 *                     action:
 *                       type: string
 *                       enum: [add, delete]
 *                       description: "북마크 추가 또는 삭제 작업"
 *     responses:
 *       200:
 *         description: 북마크가 성공적으로 업데이트되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "북마크 업데이트 성공"
 *                 bookmark:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       qid:
 *                         type: integer
 *                         description: 퀴즈 ID
 *                       category:
 *                         type: string
 *                         description: 퀴즈 카테고리
 *                       updateAt:
 *                         type: object
 *                         properties:
 *                           _seconds:
 *                             type: integer
 *                             description: 타임스탬프의 초 단위
 *                           _nanoseconds:
 *                             type: integer
 *                             description: 타임스탬프의 나노초 단위
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 북마크를 업데이트하는 데 실패했습니다.
 */

router.post("/", authenticate, bookmarkValidator, postBookmark);

module.exports = router;
