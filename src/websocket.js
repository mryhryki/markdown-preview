'use strict';

const FileWatcher = require('./lib/file_watcher');
const SocketManager = require('./lib/socket_manager');
const Logger = require('./lib/logger');

const WebSocketHandler = () => {
  let socketSeqNo = 1;
  FileWatcher.onFileChanged((fileinfo) => {
    SocketManager.getSockets(fileinfo.filepath).forEach((ws) => {
      ws.send(JSON.stringify(fileinfo));
    });
  });

  return (ws, req) => {
    const wsSeqNo = socketSeqNo++;
    try {
      Logger.debug('WebSocket connected:', wsSeqNo);
      const filepath = req.query.path.substr(1);
      FileWatcher.addTargetFile(filepath);
      SocketManager.addSocket(ws, filepath);

      ws.on('close', () => {
        Logger.debug('WebSocket close:', wsSeqNo);
        SocketManager.removeSocket(ws);
        if (SocketManager.countSocket(filepath) === 0) {
          FileWatcher.removeTargetFile(filepath);
        }
      });

      ws.send(JSON.stringify(FileWatcher.getFileInfo(filepath)));
    } catch (e) {
      Logger.error(e);
    }
  };
};

module.exports = WebSocketHandler;
