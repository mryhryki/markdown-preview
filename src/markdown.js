"use strict";

const path = require("path");
const { rootDir } = require("./lib/directory");
const { existsFile } = require("./lib/file");

const MarkdownHandler = (template) => (req, res, next) => {
  const filepath = path.resolve(rootDir, decodeURIComponent(req.path.substr(1)));
  if (existsFile(filepath)) {
    res.sendFile(template);
  } else {
    next();
  }
};

module.exports = MarkdownHandler;
