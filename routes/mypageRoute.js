const express = require("express");

const { getMypage } = require("../controllers/mypageController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * /mypage:
 *   get:
 *     summary: 사용자의 마이페이지 정보를 가져옵니다.
 *     tags: [Mypage]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 사용자의 마이페이지 정보를 성공적으로 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       description: 사용자 고유 ID
 *                       example: "11KVMIXZ4gTviImrtO1nM1bVaXq2"
 *                     email:
 *                       type: string
 *                       description: 사용자 이메일
 *                       example: "test12@test.com"
 *                     name:
 *                       type: string
 *                       description: 사용자 이름
 *                       example: "테스트"
 *                     createdAt:
 *                       type: object
 *                       properties:
 *                         _seconds:
 *                           type: integer
 *                           description: 생성 날짜 (초 단위)
 *                           example: 1733459131
 *                         _nanoseconds:
 *                           type: integer
 *                           description: 생성 날짜 (나노초 단위)
 *                           example: 338000000
 *                     quizTime:
 *                       type: integer
 *                       description: 사용자가 푼 퀴즈 수
 *                       example: 3
 *                     bookmarkNum:
 *                       type: integer
 *                       description: 사용자의 즐겨찾기 개수
 *                       example: 3
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 마이페이지 정보를 가져오는 데 실패했습니다.
 */

router.get("/", authenticate, getMypage);

module.exports = router;
