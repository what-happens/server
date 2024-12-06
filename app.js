require("./config/env"); //env.js 호출하여 환경 변수 로드
const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const { initializeFirebaseApp } = require("./config/firebase");
const { PORT } = require("./config/env");
const cookieParser = require("cookie-parser");

const app = express();
initializeFirebaseApp();

const routes = require("./routes"); //index.js 자동 탐색

app.use(cookieParser());
app.use(cors(corsConfig));
//JSON 요청을 자동으로 파싱해주는 미들웨어
app.use(express.json());
//모든 라우트 연결
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
