const express = require("express");
const {
  quizQueryValidator,
  quizParamValidator,
} = require("../validators/quizValidator");
const {
  getQuiz,
  getQuizzes,
  storeQuizResult,
} = require("../controllers/quizController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /quiz:
 *   get:
 *     summary: "랜덤 퀴즈를 가져옵니다."
 *     tags: [Quiz]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: 퀴즈의 카테고리
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: 가져올 퀴즈 수
 *     responses:
 *       200:
 *         description: 랜덤 퀴즈 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quiz:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       category:
 *                         type: string
 *                       question:
 *                         type: string
 *                       correct_answer:
 *                         type: string
 *                       incorrect_answers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isBookmark:
 *                         type: boolean
 *                   example:
 *                     - id: 0
 *                       category: "HTML"
 *                       question: "HTML은 무엇의 약자일까요?"
 *                       correct_answer: "Hypertext Markup Language"
 *                       incorrect_answers:
 *                         - "Hyperlink and Text Markup Language"
 *                         - "Hypermeida Text Language"
 *                         - "High-text Markup Language"
 *                       isBookmark: false
 *                     - id: 1
 *                       category: "HTML"
 *                       question: "HTML 문서의 기본 구조에서 가장 바깥쪽 태그는 무엇인가요?"
 *                       correct_answer: "html"
 *                       incorrect_answers:
 *                         - "body"
 *                         - "head"
 *                         - "main"
 *                       isBookmark: true
 *                     - id: 8
 *                       category: "HTML"
 *                       question: "하이퍼링크를 만드는 태그는 무엇인가요?"
 *                       correct_answer: "a"
 *                       incorrect_answers:
 *                         - "link"
 *                         - "href"
 *                         - "url"
 *                       isBookmark: false
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

router.get("/", authenticate, quizQueryValidator, getQuizzes);
/**
 * @swagger
 * /quiz/{qid}:
 *   get:
 *     summary: "퀴즈 정보를 가져옵니다."
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: qid
 *         required: true
 *         description: 퀴즈의 고유 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 퀴즈 정보가 성공적으로 조회되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quiz:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: "HTML"
 *                     question:
 *                       type: string
 *                       example: "순서가 있는 목록을 만드는 태그는 무엇인가요?"
 *                     correct_answer:
 *                       type: string
 *                       example: "ol"
 *                     incorrect_answers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["ul", "li", "list"]
 *                     id:
 *                       type: integer
 *                       example: 10
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

router.get("/:qid", authenticate, quizParamValidator, getQuiz);
/**
 * @swagger
 * /quiz/results:
 *   post:
 *     summary: "퀴즈 결과를 저장합니다."
 *     tags: [Quiz]
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
 *                     category:
 *                       type: string
 *                     action:
 *                       type: string
 *                       enum: [add, delete]
 *               review:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     qid:
 *                       type: integer
 *                     category:
 *                       type: string
 *     security:
 *       - cookieAuth: []  # 쿠키 기반 인증 (accessToken)
 *     responses:
 *       200:
 *         description: 퀴즈 결과가 성공적으로 저장되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "퀴즈 결과를 성공적으로 저장했습니다."
 *                 bookmark:
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
 *                             description: 타임스탬프의 초 단위
 *                           _nanoseconds:
 *                             type: integer
 *                             description: 타임스탬프의 나노초 단위
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
 *                             description: 타임스탬프의 초 단위
 *                           _nanoseconds:
 *                             type: integer
 *                             description: 타임스탬프의 나노초 단위
 *                 quizTime:
 *                   type: integer
 *                   description: 퀴즈를 푼 횟수
 *       400:
 *         description: 요청 파라미터에 오류가 있습니다.
 *       401:
 *         description: 인증되지 않았거나, 리프레시 토큰이 만료되어 새로운 액세스 토큰을 발급할 수 없습니다. 로그인 후 다시 시도해주세요.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

router.post("/results", authenticate, storeQuizResult);
module.exports = router;
