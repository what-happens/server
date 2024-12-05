require("./config/env"); //env.js 호출하여 환경 변수 로드
require("./config/firebase");

const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const routes = require("./routes"); //index.js 자동 탐색
const { PORT } = require("./config/env");

const app = express();

app.use(cors(corsConfig));

//JSON 요청을 자동으로 파싱해주는 미들웨어
app.use(express.json());

//모든 라우트 연결
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
