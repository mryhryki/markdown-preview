#!/usr/bin/env node
'use strict';

const express = require('express');
const expressWs = require('express-ws');
const { showUsage, filepath, port } = require('./lib/args');
const { IndexHandler } = require('./lib/middleware_index');
const { WebSocketHandler, sendSockets } = require('./lib/middleware_websocket');
const { startFileWatch, getFileContent } = require('./lib/file_watcher');

try {
  console.log('Markdown File :', filepath);
  console.log(`Preview URL   : http://localhost:${port}/`);

  startFileWatch({
    filepath,
    onFileChanged: ({ content }) => {
      sendSockets(content);
    },
  });

  const app = express();
  expressWs(app);
  app.ws('/ws', WebSocketHandler((ws) => ws.send(getFileContent(filepath))));
  app.get('/', IndexHandler);
  app.listen(port);

} catch (err) {
  console.error(err.message);
  showUsage();
}
