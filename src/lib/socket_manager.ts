import type WebSocket from "ws";

interface Socket {
  filepath: string;
  socket: WebSocket;
}

export class SocketManager {
  public _sockets: Socket[];

  constructor() {
    this._sockets = [];
  }

  addSocket(socket: WebSocket, filepath: string) {
    this._sockets.push({ socket, filepath });
  }

  removeSocket(socket: WebSocket) {
    this._sockets = this._sockets.filter(({ socket: s }) => s !== socket);
  }

  getSockets(filepath: string) {
    return this._sockets
      .filter(({ filepath: fp }) => fp === filepath)
      .map((s) => s.socket);
  }

  countSocket(filepath: string | null = null) {
    if (filepath == null) {
      return this._sockets.length;
    }
    return this.getSockets(filepath).length;
  }
}
