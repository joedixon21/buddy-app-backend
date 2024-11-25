function capitalizeName(name) {
  if (typeof name !== "string") return;
  name = name.replaceAll(/\s+/g, " ");
  const splitName = name.split(" ");

  const capitalizedName = splitName
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");

  return capitalizedName;
}

module.exports = { capitalizeName };
