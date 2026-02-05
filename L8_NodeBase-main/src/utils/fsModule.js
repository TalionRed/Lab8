const fsSync = require('../fs/fsSync');
const fsAsync = require('../fs/fsAsync');

module.exports = {
  ...fsSync,
  ...fsAsync,
};

