import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import XTerm, { RefProps } from "./components/XTerm";
import Notification from "./components/Notification";
import SocketContext, { SocketContextProvider } from "./helpers/SocketContext";
import socket from "./helpers/Socket";
import Credentials from "./helpers/Credentials";

function App() {
  const terminalRef = useRef<RefProps>(null);
  const [connectedToSocket, setConnectedToSocket] = useState<boolean>(false);
  const [sshConnection, setSshConnection] = useState<boolean>(false);

  const [context, setContext] = useState<SocketContextProvider>({
    credentials: new Credentials("", "", "", 0),
    socket,
  });

  socket.on("connect", () => {
    setConnectedToSocket(true);
  });

  socket.on("disconnect", () => {
    setConnectedToSocket(false);
  });

  socket.on("setSshConnection", (value) => {
    setSshConnection(value);
  });

  useEffect(() => {
    if (!sshConnection) {
      setSshConnection(false);
      terminalRef.current?.writeln("Please login your connection string.");
      terminalRef.current?.writeln(
        "Example: \x1b[1;35mroot\x1b[1;37m@127.0.0.1:22/password"
      );
      terminalRef.current?.write("Connection: ");
    }
  }, [connectedToSocket]);

  const submit = (cmd: string) => {
    if (!sshConnection) {
      return handleAuth(cmd);
    }

    socket.emit("run", cmd);
  };

  const handleAuth = (response: string) => {
    try {
      let splitted = response.split("@");
      context.credentials.setUser(splitted[0]);

      splitted = splitted[1].split(":");
      context.credentials.setHostname(splitted[0]);

      splitted = splitted[1].split("/");
      context.credentials.setPort(parseInt(splitted[0]));
      context.credentials.setPassword(splitted[1]);

      socket.emit("connectToSsh", context.credentials);
    } catch {
      location.reload();
    }
  };

  return (
    <div className="App">
      <div className="Inner">
        {!connectedToSocket && (
          <Notification text="Waiting socket connection" />
        )}

        <SocketContext.Provider value={context}>
          {sshConnection && <XTerm submit={submit} />}

          {!sshConnection && <XTerm ref={terminalRef} submit={submit} />}
        </SocketContext.Provider>
      </div>
    </div>
  );
}

export default App;
