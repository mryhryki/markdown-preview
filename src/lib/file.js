'use strict';

const fs = require('fs');

const existsFile = (filepath) => {
  try {
    fs.statSync(filepath);
    return true;
  } catch (_) {
    return false;
  }
};

module.exports = {
  existsFile,
};
