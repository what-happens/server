require("./config/env"); //env.js 호출하여 환경 변수 로드
const express = require("express");
const cors = require("cors");
const corsConfig = require("./config/cors");
const { initializeFirebaseApp } = require("./config/firebase");
const { PORT } = require("./config/env");
const cookieParser = require("cookie-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { swaggerOptions } = require("./config/swagger");

const app = express();
initializeFirebaseApp();

const routes = require("./routes"); //index.js 자동 탐색
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cookieParser());
app.use(cors(corsConfig));
//JSON 요청을 자동으로 파싱해주는 미들웨어
app.use(express.json());
//모든 라우트 연결
app.use(routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
