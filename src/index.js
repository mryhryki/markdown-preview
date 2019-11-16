'use strict';

const express = require('express');
const expressWs = require('express-ws');
const opener = require('opener');
const Logger = require('./lib/logger');
const MarkdownHandler = require('./markdown');
const WebSocketHandler = require('./websocket');
const { rootDir, staticDir } = require('./lib/directory');
const { showUsage, filepath, port, template, noOpener } = require('./lib/param');

try {
  const previewUrl = `http://localhost:${port}`;
  console.log('Root Directory :', rootDir);
  console.log('Default File   :', filepath);
  console.log('Template File  :', template);
  console.log(`Preview URL    : ${previewUrl}`);

  const app = express();
  expressWs(app);
  app.get('/', (_req, res) => res.redirect(filepath));
  app.ws('/ws', WebSocketHandler());
  app.get(`/*.md`, MarkdownHandler(template));
  app.use(express.static(rootDir));
  app.use(express.static(staticDir));
  app.listen(port);

  if (!noOpener) {
    opener(previewUrl);
  }

} catch (err) {
  Logger.error(err.message);
  showUsage();
}
