const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const quizRoute = require("./quizRoute");
const reviewRoute = require("./reviewRoute");
const bookmarkRoute = require("./bookmarkRoute");
const mypageRoute = require("./mypageRoute");
const stageRoute = require("./stageRoute");

router.use("/user", userRoute);
router.use("/quiz", quizRoute);
router.use("/review", reviewRoute);
router.use("/bookmark", bookmarkRoute);
router.use("/mypage", mypageRoute);
router.use("/stage", stageRoute);
module.exports = router;
