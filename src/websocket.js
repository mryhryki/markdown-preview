"use strict";

const path = require("path");
const FileWatcher = require("./lib/file_watcher");
const SocketManager = require("./lib/socket_manager");
const { rootDir } = require("./lib/directory");

const WebSocketHandler = (logger) => {
  let socketSeqNo = 1;
  const socketManager = new SocketManager();
  const fileWatcher = new FileWatcher(logger);
  fileWatcher.onFileChanged((fileinfo) => {
    socketManager.getSockets(fileinfo.filepath).forEach((ws) => {
      ws.send(JSON.stringify(fileinfo));
    });
  });

  return (ws, req) => {
    const wsSeqNo = socketSeqNo++;
    try {
      logger.debug("WebSocket connected:", wsSeqNo);
      const filepath = path.resolve(rootDir, decodeURIComponent(req.query.path.substr(1)));
      fileWatcher.addTargetFile(filepath);
      socketManager.addSocket(ws, filepath);

      ws.on("close", () => {
        logger.debug("WebSocket close:", wsSeqNo);
        socketManager.removeSocket(ws);
        if (socketManager.countSocket(filepath) === 0) {
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
