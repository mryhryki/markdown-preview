import { FileChangedEvent } from "./lib/file_watcher";
import { Logger } from "./lib/logger";

import WebSocket from "ws";
import path from "path";
import { FileWatcher } from "./lib/file_watcher";
import { Request } from "express";
import { SocketManager } from "./lib/socket_manager";
import { rootDir } from "./lib/directory";

export function WebSocketHandler(logger: Logger) {
  let socketSeqNo = 1;
  const socketManager = new SocketManager();
  const fileWatcher = new FileWatcher(logger);
  fileWatcher.onFileChanged((fileinfo: FileChangedEvent) => {
    socketManager.getSockets(fileinfo.filepath).forEach((ws) => {
      ws.send(JSON.stringify(fileinfo));
    });
  });

  return (ws: WebSocket, req: Request) => {
    const wsSeqNo = socketSeqNo++;
    try {
      logger.debug("WebSocket connected:", wsSeqNo);
      const pathInQuery: string = typeof req.query.path === "string" ? req.query.path : "";
      const filepath = path.resolve(rootDir, decodeURIComponent(pathInQuery.substring(1)));
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
}
