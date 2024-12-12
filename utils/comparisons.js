function compareTime(a, b) {
  if (a.updateAt._seconds - b.updateAt._seconds > 0) {
    // a가 늦게 생성된 경우
    return -1;
  } else if (a.updateAt._seconds - b.updateAt._seconds < 0) {
    //a가 일찍 생성된 경우
    return 1;
  } else {
    //seconds까지 동일한 경우
    if (a.updateAt._nanoseconds - b.updateAt._nanoseconds > 0) {
      //a가 늦게 생성된 경우
      return -1;
    } else {
      return 1;
    }
  }
}

module.exports = { compareTime };
