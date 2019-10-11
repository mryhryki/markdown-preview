#!/usr/bin/env node
'use strict';

const path = require('path');
const express = require('express');
const expressWs = require('express-ws');
const yargs = require('yargs');
const { IndexHandler } = require('./lib/middleware_index');
const { WebSocketHandler, sendSockets } = require('./lib/middleware_websocket');
const { startFileWatch, getFileContent } = require('./lib/file_watcher');

try {
  const Args = yargs
    .help('help')
    .alias('help', 'h')
    .option('target', { alias: 't', default: './README.md', description: 'markdown file path' })
    .option('port', { alias: 'p', default: 34567, description: 'server port' })
    .argv;

  if (Args.target == null) {
    throw new Error('`--target/-t` option not specified.');
  }
  const targetFilePath = path.isAbsolute(Args.target) ? Args.target : path.resolve(process.cwd(), Args.target);

  console.log('Markdown File :', targetFilePath);
  console.log(`Preview URL   : http://localhost:${Args.port}/`);

  startFileWatch({
    filepath: targetFilePath,
    onFileChanged: ({ content }) => {
      sendSockets(content);
    },
  });

  const app = express();
  expressWs(app);
  app.ws('/ws', WebSocketHandler((ws) => ws.send(getFileContent(targetFilePath))));
  app.get('/', IndexHandler);
  app.listen(Args.port);

} catch (err) {
  console.error(err.message);
  process.exit(1);
}
