require("./config/env"); //env.js 호출하여 환경 변수 로드
require("./config/firebase");

const express = require("express");
const routes = require("./routes"); //index.js 자동 탐색

const { PORT } = require("./config/env");

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
