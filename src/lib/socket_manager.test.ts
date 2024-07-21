import type WebSocket from "ws";
import { SocketManager } from "./socket_manager";

// biome-ignore lint/suspicious/noExplicitAny: It is used for testing only.
const dummySocket1: WebSocket = { name: "socket1" } as any;
// biome-ignore lint/suspicious/noExplicitAny: It is used for testing only.
const dummySocket2: WebSocket = { name: "socket2" } as any;
// biome-ignore lint/suspicious/noExplicitAny: It is used for testing only.
const dummySocket3: WebSocket = { name: "socket3" } as any;

const dummyFilepath1 = "file1";
const dummyFilepath2 = "file2";

const dummyInfo1 = { socket: dummySocket1, filepath: dummyFilepath1 };
const dummyInfo2 = { socket: dummySocket2, filepath: dummyFilepath2 };
const dummyInfo3 = { socket: dummySocket3, filepath: dummyFilepath2 };

describe("SocketManager", () => {
  it("works normally", () => {
    const socketManager = new SocketManager();
    expect(socketManager._sockets).toEqual([]);

    socketManager.addSocket(dummySocket1, dummyFilepath1);
    expect(socketManager._sockets).toEqual([dummyInfo1]);

    socketManager.addSocket(dummySocket2, dummyFilepath2);
    expect(socketManager._sockets).toEqual([dummyInfo1, dummyInfo2]);

    socketManager.addSocket(dummySocket3, dummyFilepath2);
    expect(socketManager._sockets).toEqual([
      dummyInfo1,
      dummyInfo2,
      dummyInfo3,
    ]);

    expect(socketManager.getSockets(dummyFilepath1)).toEqual([dummySocket1]);
    expect(socketManager.getSockets(dummyFilepath2)).toEqual([
      dummySocket2,
      dummySocket3,
    ]);
    expect(socketManager.countSocket()).toEqual(3);
    expect(socketManager.countSocket(dummyFilepath1)).toEqual(1);
    expect(socketManager.countSocket(dummyFilepath2)).toEqual(2);

    socketManager.removeSocket(dummySocket2);
    expect(socketManager._sockets).toEqual([dummyInfo1, dummyInfo3]);

    socketManager.removeSocket(dummySocket1);
    expect(socketManager._sockets).toEqual([dummyInfo3]);

    socketManager.removeSocket(dummySocket3);
    expect(socketManager._sockets).toEqual([]);
  });
});
