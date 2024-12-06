function shffleArray(array) {
  //snapShot data가 array의 요소로 들어오기 때문에 깊은 복사 필요
  const newArray = JSON.parse(JSON.stringify([...array]));
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

module.exports = { shffleArray };
