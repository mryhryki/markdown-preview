'use strict';

let sockets = [];

const WebSocketHandler = (onConnect) => (ws/* , req */) => {
  try {
    sockets.push(ws);
    ws.on('close', () => {
      sockets = sockets.filter(socket => socket !== ws);
    });
    onConnect(ws);
  } catch (e) {
    console.error(e);
  }
};

const sendSockets = (payload) => {
  if (!Array.isArray(sockets)) {
    console.error('`sockets` is not Array');
    return;
  }
  sockets.forEach((socket) => {
    socket.send(payload);
  });
};

module.exports = {
  WebSocketHandler,
  sendSockets,
};
