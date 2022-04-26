import React, { useEffect, useState } from "react";
import "./App.css";
import XTerm from "./components/XTerm";
import socketIOClient, { Socket } from "socket.io-client";
import Notification from "./components/Notification";
import SocketContext from "./helpers/SocketContext";

const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [connectedToSocket, setConnectedToSocket] = useState<boolean>(false);
  const socket = socketIOClient(ENDPOINT);

  socket.on("connect", () => {
    setConnectedToSocket(true);
  });

  socket.on("disconnect", () => {
    setConnectedToSocket(false);
  });

  socket.on("sshConnectionEstablished", (data) => {
    console.log(data);
  });

  useEffect(() => {
    setResponseMessage("Hostname: ");
  }, []);

  const submit = (cmd: string) => {
    console.log(cmd);
  };

  const response = (message: string) => {
    console.log(message);
    setResponseMessage("");
  };

  return (
    <div className="App">
      <SocketContext.Provider value={socket as Socket}>
        <div className="Inner">
          {!connectedToSocket && (
            <Notification text="Waiting socket connection" />
          )}

          <XTerm
            key={"terminal"}
            submit={submit}
            responseMessage={responseMessage}
            response={response}
          />
        </div>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
