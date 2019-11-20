'use strict';

const FileWatcher = require('./lib/file_watcher');
const SocketManager = require('./lib/socket_manager');

const WebSocketHandler = (logger) => {
  let socketSeqNo = 1;
  const fileWatcher = new FileWatcher(logger);
  fileWatcher.onFileChanged((fileinfo) => {
    SocketManager.getSockets(fileinfo.filepath).forEach((ws) => {
      ws.send(JSON.stringify(fileinfo));
    });
  });

  return (ws, req) => {
    const wsSeqNo = socketSeqNo++;
    try {
      logger.debug('WebSocket connected:', wsSeqNo);
      const filepath = req.query.path.substr(1);
      fileWatcher.addTargetFile(filepath);
      SocketManager.addSocket(ws, filepath);

      ws.on('close', () => {
        logger.debug('WebSocket close:', wsSeqNo);
        SocketManager.removeSocket(ws);
        if (SocketManager.countSocket(filepath) === 0) {
          fileWatcher.removeTargetFile(filepath);
        }
      });

      ws.send(JSON.stringify(fileWatcher.getFileInfo(filepath)));
    } catch (e) {
      logger.error(e);
    }
  };
};

module.exports = WebSocketHandler;
