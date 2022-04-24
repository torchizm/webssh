import React, { useEffect, useState } from "react";
import "./App.css";
import XTerm from "./components/XTerm";
import socketIOClient from "socket.io-client";
import Notification from "./components/Notification";

const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  const [connectedToSocket, setConnectedToSocket] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const socket = socketIOClient(ENDPOINT);

  socket.on("connect", () => {
    console.log("Connected to the server.");
    handleSocketStatus(true);
  });

  socket.on("disconnect", () => {
    handleSocketStatus(false);
  });

  socket.on("sshConnectionEstablished", (data) => {
    console.log(data);
  });

  useEffect(() => {
    setResponseMessage("Hostname: ");
  }, []);

  const handleSocketStatus = (status: boolean) => {
    setConnectedToSocket(status);
  };

  const submit = (cmd: string) => {
    console.log(cmd);
  };

  const response = (message: string) => {
    console.log(message);
    setResponseMessage("");
  };

  return (
    <div className="App">
      <div className="Inner">
        {!connectedToSocket && (
          <Notification text="Socket connection waiting" />
        )}

        <XTerm
          key={"terminal"}
          submit={submit}
          responseMessage={responseMessage}
          canType={connectedToSocket}
          response={response}
        />
      </div>
    </div>
  );
}

export default App;
