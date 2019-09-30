#!/usr/bin/env node
'use strict';

try {
  const fs = require('fs');
  const path = require('path');
  const express = require('express');
  const expressWs = require('express-ws');
  const Args = require('yargs')
    .help('help')
    .alias('help', 'h')
    .option('target', { alias: 't', default: null, description: 'relative/absolute markdown file path' })
    .option('verbose', { alias: 'v', default: false })
    .option('port', { alias: 'p', default: 34567, description: 'server port' })
    .option('interval', { default: 300, description: 'file polling interval (ms)' })
    .argv;

  if (Args.target == null) {
    throw new Error('`--target/-t` option not specified.');
  }
  const debugLog = (log) => Args.verbose && console.log(log);
  const targetFilePath = path.isAbsolute(Args.target) ? Args.target : path.resolve(process.cwd(), Args.target);

  console.log('Target  :', targetFilePath);
  console.log('Port    :', Args.port);
  console.log('Interval:', Args.interval, 'ms');
  console.log('Verbose :', Args.verbose);
  console.log(`Preview : http://localhost:${Args.port}/`);

  // -------------------------------------------------------------------------------------------------

  const app = express();
  app.use(express.static('static'));
  expressWs(app);

  // -------------------------------------------------------------------------------------------------

  let sockets = [];
  const getLastModified = () => fs.statSync(targetFilePath).mtimeMs;
  const getFileContent = () => fs.readFileSync(targetFilePath, 'utf-8');

  // -------------------------------------------------------------------------------------------------

  let count = 1;
  app.ws('/ws', (ws/* , req */) => {
    try {
      const id = count++;
      sockets.push(ws);
      debugLog(`WebSocket connected: ${id}`);
      ws.send(getFileContent());

      ws.on('close', () => {
        sockets = sockets.filter(socket => socket !== ws);
        debugLog(`WebSocket closed: ${id}`);
      });
    } catch (e) {
      console.error(e);
    }
  });

  const sendSockets = (payload) => {
    if (!Array.isArray(sockets)) {
      console.error('`sockets` is not Array');
      return;
    }
    sockets.forEach((socket) => {
      socket.send(payload);
    });
  };

  // -------------------------------------------------------------------------------------------------

  app.get('/', (_req, res, next) => {
    res.send(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
  >
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.css">
  <title>Markdown</title>
  <style type="text/css">
    body {
      margin: 0 auto;
      max-width: 800px;
    }
  </style>
</head>
<body>
  <div class="markdown-body">
    <div id="content"></div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script type="text/javascript">
    const ws = new WebSocket(\`\${location.protocol.replace('http', 'ws')}//\${location.host}/ws\`);
    ws.addEventListener('open', (event) => {
      console.log('WebSocket opened:', event);
    });
    ws.addEventListener('message', (event) => {
      console.log('WebSocket received:', event);
      const content = document.getElementById('content');
      if (content != null) {
        content.innerHTML = marked(event.data);
      }
    });
  </script>
</body>
</html>`);
    next();
  });

  // -------------------------------------------------------------------------------------------------

  let lastModified = getLastModified();
  setInterval(() => {
    const currentLastModified = getLastModified();
    if (lastModified !== currentLastModified) {
      debugLog('File changed');
      lastModified = currentLastModified;
      sendSockets(getFileContent());
    }

  }, Args.interval);

  // -------------------------------------------------------------------------------------------------
  app.listen(Args.port);

} catch (err) {
  console.error(err.message);
  process.exit(1);
}
