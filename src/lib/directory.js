'use strict';

const path = require('path');

const currentDir = process.cwd();
const rootDir = path.resolve(__dirname, '..', '..');
const staticDir = path.resolve(rootDir, 'static');
const templateDir = path.resolve(rootDir, 'template');

module.exports = {
  currentDir,
  rootDir,
  staticDir,
  templateDir,
};
