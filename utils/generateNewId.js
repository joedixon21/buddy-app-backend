function generateNewId(arr) {
  if (arr.length === 0) return 1;

  let length = arr.length;
  let max = -Infinity;
  while (length--) {
    if (arr[length] > max) {
      max = arr[length];
    }
  }
  return max + 1;
}

module.exports = { generateNewId };
