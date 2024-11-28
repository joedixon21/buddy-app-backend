function formatName(name, type) {
  const charRegex = /[a-zA-Z]/;
  let nameCopy = name;
  if (typeof nameCopy !== "string") return null;

  if (type === "scientific") {
    let splitName = nameCopy.split(" ");
    const wordsFiltered = [];

    for (let i = 0; i < splitName.length; i++) {
      if (splitName[i][0].match(charRegex)) {
        wordsFiltered.push(splitName[i]);
      }
      if (!splitName[i][0].match(charRegex)) {
        break;
      }
    }

    nameCopy = wordsFiltered.join(" ");
  }

  if (!nameCopy) return "";

  nameCopy = nameCopy.replaceAll(/\s+/g, " ");
  const splitName = nameCopy.split(" ");

  const formatName = splitName
    .map((word) => {
      if (!charRegex.test(word[0])) {
        return word[0] + word[1].toUpperCase() + word.slice(2).toLowerCase();
      }
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return formatName;
}

module.exports = { formatName };
