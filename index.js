'use strict';

const fs = require('fs');
const express = require('express');
const expressWs = require('express-ws');

const Config = {};
Config.targetFilePath = './test.md';
Config.port = 34567;
Config.verbose = true;
Config.intervalMilliSec = 500;

const app = express();
app.use(express.static('static'));
expressWs(app);

// -------------------------------------------------------------------------------------------------

let sockets = [];
const getLastModified = () => fs.statSync(Config.targetFilePath).mtimeMs;
const getFileContent = () => fs.readFileSync(Config.targetFilePath, 'utf-8');

// -------------------------------------------------------------------------------------------------

app.ws('/ws', (ws/* , req */) => {
  try {
    sockets.push(ws);
    console.log('WebSocket connected');
    ws.send(getFileContent());

    ws.on('message', (message) => {
      if (Config.verbose) {
        console.log(`WebSocket message: ${message}`);
      }
    });

    ws.on('close', () => {
      sockets = sockets.filter(socket => socket !== ws);
      console.log('WebSocket closed:');
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
    if (Config.verbose) {
      console.log('File changed');
    }
    lastModified = currentLastModified;
    sendSockets(getFileContent());
  }

}, Config.intervalMilliSec);

// Start!
app.listen(Config.port);
console.log(`Express Server Ready http://localhost:${Config.port}/`);
