'use strict';

const path = require('path');

const rootDir = process.cwd();
const projectDir = path.resolve(__dirname, '..', '..');
const staticDir = path.resolve(projectDir, 'static');
const templateDir = path.resolve(projectDir, 'template');

module.exports = {
  rootDir,
  projectDir,
  staticDir,
  templateDir,
};
