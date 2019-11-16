'use strict';

class SocketManager {
  constructor() {
    this._sockets = [];
  }

  addSocket(socket, filepath) {
    this._sockets.push({ socket, filepath });
  }

  removeSocket(socket) {
    this._sockets = this._sockets.filter(({ socket: s }) => s !== socket);
  }

  getSockets(filepath) {
    return this._sockets
               .filter(({ filepath: fp }) => fp === filepath)
               .map(s => s.socket);
  }

  countSocket(filepath = null) {
    if (filepath == null) {
      return this._sockets.length;
    }
    return this.getSockets(filepath).length;
  }
}

module.exports = new SocketManager();
