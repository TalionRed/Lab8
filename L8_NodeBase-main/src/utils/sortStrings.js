function sortStringsIgnoreSpaces(strings) {
  if (!Array.isArray(strings)) return [];

  return [...strings].sort((a, b) => {
    const normalizedA = a.replace(/\s+/g, '').toLowerCase();
    const normalizedB = b.replace(/\s+/g, '').toLowerCase();

    if (normalizedA < normalizedB) return -1;
    if (normalizedA > normalizedB) return 1;
    return 0;
  });
}

module.exports = {
  sortStringsIgnoreSpaces,
};

