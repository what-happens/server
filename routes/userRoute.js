const express = require("express");
const {
  validateCreateUser,
  validateLogin,
} = require("../validators/userValidator");
const {
  createUser,
  loginUser,
  logoutUser,
  deleteUser,
} = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 이메일과 비밀번호를 사용해 새로운 사용자를 생성합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일
 *               password:
 *                 type: string
 *                 description: 사용자의 비밀번호 (6자 이상)
 *               name:
 *                 type: string
 *                 description: 사용자의 이름
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 성공 메시지
 *                   example: "회원가입에 성공했습니다"
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       description: 사용자 고유 ID
 *                       example: "11KVMIXZ4gTviImrtO1nM1bVaXq2"
 *                     email:
 *                       type: string
 *                       description: 사용자의 이메일
 *                       example: "test12@test.com"
 *                     name:
 *                       type: string
 *                       description: 사용자의 이름
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
 *       400:
 *         description: 요청 검증 실패. 필수 필드나 형식에 문제가 있습니다.
 *       500:
 *         description: 서버 에러
 */
router.post("/signup", validateCreateUser, createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 이메일과 비밀번호를 사용하여 사용자를 인증합니다.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일
 *               password:
 *                 type: string
 *                 description: 사용자의 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공. 응답에 쿠키가 포함됩니다.
 *       400:
 *         description: 인증 실패 (이메일 또는 비밀번호 오류)
 *       500:
 *         description: 서버 에러
 */
router.post("/login", validateLogin, loginUser);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 인증된 사용자가 로그아웃합니다. 로그아웃 시 쿠키가 삭제됩니다.
 *                  만료된 토큰일 경우 새로운 토큰으로 갱신한 후 로그아웃을 수행합니다.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공. 쿠키가 삭제됩니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 에러
 */
router.post("/logout", authenticate, logoutUser);

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: 사용자 삭제 (회원 탈퇴)
 *     description: 인증된 사용자가 계정을 삭제합니다. 요청 시 쿠키와 인증 토큰이 필요합니다.
 *                  만료된 토큰일 경우 새로운 토큰으로 갱신한 후 삭제를 수행합니다.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 계정 삭제 성공. 사용자 데이터가 삭제됩니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 계정 삭제 실패
 */

router.delete("/delete", authenticate, deleteUser);

module.exports = router;
