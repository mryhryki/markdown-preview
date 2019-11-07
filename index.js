#!/usr/bin/env node
'use strict';

const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const opener = require('opener');
const { showUsage, filepath, port } = require('./lib/args');
const { MarkdownHandler } = require('./lib/middleware_markdown');
const { WebSocketHandler, sendSockets } = require('./lib/middleware_websocket');
const { startFileWatch, getFileContent } = require('./lib/file_watcher');

try {
  const rootDir = process.cwd();
  const previewUrl = `http://localhost:${port}/`;
  console.log('Root Directory :', rootDir);
  console.log('Default File   :', filepath);
  console.log(`Preview URL    : ${previewUrl}`);

  startFileWatch({
    filepath: path.resolve(rootDir, filepath),
    onFileChanged: ({ content }) => {
      sendSockets(content);
    },
  });

  const app = express();
  expressWs(app);
  app.get('/', (_req, res) => res.redirect(filepath));
  app.ws('/ws', WebSocketHandler((ws) => ws.send(getFileContent(path.resolve(rootDir, filepath)))));
  app.get(`/${filepath}`, MarkdownHandler);
  app.use(express.static(rootDir));
  app.listen(port);

  opener(previewUrl);

} catch (err) {
  console.error(err.message);
  showUsage();
}
