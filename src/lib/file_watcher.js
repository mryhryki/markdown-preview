'use strict';

const fs = require('fs');
const WatchIntervalMs = 250;

const getLastModified = (filepath) => fs.statSync(filepath).mtimeMs;
const getFileContent = (filepath) => fs.readFileSync(filepath, 'utf-8');

let lastModified = null;
let intervalId = null;

const startFileWatch = ({ filepath, onFileChanged }) => {
  if (intervalId != null) return;
  intervalId = setInterval(() => {
    const currentLastModified = getLastModified(filepath);
    if (lastModified !== currentLastModified) {
      lastModified = currentLastModified;
      onFileChanged({
        content: getFileContent(filepath),
      });
    }
  }, WatchIntervalMs);
};

module.exports = {
  startFileWatch,
  getLastModified,
  getFileContent,
};
