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
  const targetFilePath = path.isAbsolute(Args.target) ? Args.target : path.resolve(process.cwd(), Args.target);

  console.log('Target  :', targetFilePath);
  console.log('Port    :', Args.port);
  console.log('Interval:', Args.interval, 'ms');
  console.log('Verbose :', Args.verbose);

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
      console.log(`WebSocket connected: ${id}`);
      ws.send(getFileContent());

      ws.on('close', () => {
        sockets = sockets.filter(socket => socket !== ws);
        console.log(`WebSocket closed: ${id}`);
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

  let lastModified = getLastModified();
  setInterval(() => {
    const currentLastModified = getLastModified();
    if (lastModified !== currentLastModified) {
      if (Args.verbose) {
        console.log('File changed');
      }
      lastModified = currentLastModified;
      sendSockets(getFileContent());
    }

  }, Args.interval);

  // -------------------------------------------------------------------------------------------------
  app.listen(Args.port);
  console.log(`Preview : http://localhost:${Args.port}/`);

} catch (err) {
  console.error(err.message);
  process.exit(1);
}
