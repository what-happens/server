require("./config/env"); //env.js 호출하여 환경 변수 로드

const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const routes = require("./routes"); //index.js 자동 탐색
const { PORT } = require("./config/env");
const { firebaseAdmin, firebaseClient } = require("./config/firebase");

const app = express();

app.use(cors(corsConfig));
firebaseAdmin(); //admin 초기화
//client 초기화  firebase는 server에서 로그인과 패스워드로 로그인을 직접 처리 불가
//firebaseClient 로 서버에서 로그인 처리 후 idToken을 클라이언트에 넘겨주는 방식 사용
firebaseClient();

//JSON 요청을 자동으로 파싱해주는 미들웨어
app.use(express.json());

//모든 라우트 연결
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
