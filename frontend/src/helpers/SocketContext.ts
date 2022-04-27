import { createContext } from "react";
import { Socket } from "socket.io-client";
import Credentials from "./Credentials";
import socket from "./Socket";

export type SocketContextProvider = {
  socket: Socket;
  credentials: Credentials;
};

const SocketContext = createContext<SocketContextProvider>({
  credentials: new Credentials("", "", "", 0),
  socket: socket,
});

export default SocketContext;
