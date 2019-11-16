'use strict';

const { existsFile } = require('./lib/file');

const MarkdownHandler = (template) => (req, res, next) => {
  const filepath = req.path.substr(1);
  if (existsFile(filepath)) {
    res.sendFile(template);
  } else {
    next();
  }
};

module.exports = MarkdownHandler;
