const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const quizRoute = require("./quizRoute");
router.use("/user", userRoute);
router.use("/quiz", quizRoute);
module.exports = router;
