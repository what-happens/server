function selectArrayElement(array, limit) {
  const selectedArray = [];
  const copyArray = [...array]; // 원본 배열 수정 방지
  const length = Math.min(limit, copyArray.length);
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    selectedArray[selectedArray.length] = copyArray[randomIndex];
    copyArray.splice(randomIndex, 1);
  }
  return selectedArray;
}

module.exports = { selectArrayElement };
