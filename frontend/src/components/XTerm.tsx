import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { DisabledKeys, FilteredKeys, KeyHandlers } from "../helpers/KeysHelper";
import { CommandsHelper } from "../helpers/CommandsHelper";
import SocketContext, { SocketContextProvider } from "../helpers/SocketContext";

type Props = {
  submit: (cmd: string) => void;
};

export type RefProps = {
  write: (message: string) => void;
  writeln: (message: string) => void;
  clear: () => void;
};

const XTerm = React.forwardRef<RefProps, Props>(({ submit }, ref) => {
  const { socket, credentials } = useContext(
    SocketContext
  ) as SocketContextProvider;

  const terminalElement = useRef<HTMLDivElement>(null);

  let currentLine: string = "";
  let term = new Terminal();

  useImperativeHandle(ref, () => ({
    write: (message: string) => {
      term.write("\x1b[1;37m" + message);
    },
    writeln: (message: string) => {
      term.writeln("\x1b[1;37m" + message);
    },
    clear: () => {
      term.clear();
    },
  }));

  useEffect(() => {
    var fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.open(terminalElement.current as HTMLDivElement);
    term.options.fontSize = 26;

    if (credentials.user !== "") {
      const sign = credentials.user === "root" ? "$" : "#";
      term.write(`\x1b[1;35m${credentials.user}\x1b[1;37m:~${sign} `);
    }

    term.onKey(handleOnKey);

    socket.on("write", handleWrite);
  }, [socket]);

  const handleOnKey = (event: { key: string; domEvent: KeyboardEvent }) => {
    let key: string = event.domEvent.key;

    if (!socket.connected || DisabledKeys.includes(key.toLowerCase())) {
      return;
    }

    if (event.domEvent.ctrlKey) {
      key = `Ctrl+${key}`;
    }

    if (event.domEvent.altKey) {
      key = `Alt+${key}`;
    }

    let isCommand = false;

    switch (key.toLowerCase()) {
      case "backspace":
        currentLine = currentLine.slice(0, -1);
        break;
      case "ctrl+backspace":
        currentLine = "";
        break;
      case "enter":
        let command = CommandsHelper.find((x) => x.command === currentLine);

        if (command !== undefined) {
          isCommand = true;
          command.callback(term);
        }

        if (currentLine !== "") {
          submit(currentLine);
        }

        currentLine = "";
        break;
      default:
        if (!FilteredKeys.includes(key.toLowerCase())) {
          currentLine += key;
        }
        break;
    }

    if (isCommand) {
      return;
    }

    const keyFromHandler = KeyHandlers.find((x) => x.key === key.toLowerCase());

    if (keyFromHandler !== undefined) {
      if (keyFromHandler.chars !== undefined) {
        return term.write(keyFromHandler.chars);
      }

      if (keyFromHandler.callback !== undefined) {
        return keyFromHandler.callback(term);
      }
    }

    return term.write(key);
  };

  const handleWrite = (data: ArrayBuffer) => {
    const enc = new TextDecoder("utf-8");
    let str = enc.decode(data);
    let splittedStr = str.split("\n");

    splittedStr.forEach((text) => {
      term.writeln("\x1b[1;37m" + text);
    });

    if (credentials !== undefined) {
      const sign = credentials.user === "root" ? "$" : "#";
      term.write(`\x1b[1;35m${credentials.user}\x1b[1;37m:~${sign} `);
    }

    term.scrollToBottom();
  };

  return <div ref={terminalElement}></div>;
});

export default XTerm;
