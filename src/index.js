'use strict';

const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const opener = require('opener');
const { rootDir, staticDir } = require('./lib/directory');
const { showUsage, filepath, port, template } = require('./lib/args');
const { WebSocketHandler, sendSockets } = require('./lib/websocket');
const { startFileWatch, getFileObject } = require('./lib/file_watcher');

try {
  const previewUrl = `http://localhost:${port}`;
  console.log('Root Directory :', rootDir);
  console.log('Default File   :', filepath);
  console.log('Template File  :', template);
  console.log(`Preview URL    : ${previewUrl}`);

  startFileWatch({
    filepath: path.resolve(rootDir, filepath),
    onFileChanged: (content) => {
      sendSockets(JSON.stringify(content));
    },
  });

  const app = express();
  expressWs(app);
  app.get('/', (_req, res) => res.redirect(filepath));
  app.ws('/ws', WebSocketHandler((ws) => ws.send(JSON.stringify(getFileObject(path.resolve(rootDir, filepath))))));
  app.get(`/${filepath}`, (_req, res) => res.sendFile(template));
  app.use(express.static(rootDir));
  app.use(express.static(staticDir));
  app.listen(port);

  if (process.env.NO_OPENER !== 'true') {
    opener(previewUrl);
  }

} catch (err) {
  console.error(err.message);
  showUsage();
}
