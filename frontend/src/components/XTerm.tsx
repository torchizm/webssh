import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { DisabledKeys, KeyHandlers } from "../helpers/KeysHelper";
import { CommandsHelper } from "../helpers/CommandsHelper";
import SocketContext from "../helpers/SocketContext";
import { Socket } from "socket.io-client";

type Props = {
  submit: (cmd: string) => void;
  responseMessage: string;
  response: (message: string) => void;
};

const XTerm: FunctionComponent<Props> = ({
  submit,
  responseMessage,
  response,
}) => {
  const socket = useContext(SocketContext) as Socket;
  const terminalElement = useRef<HTMLDivElement>(null);

  let currentLine: string = "";
  var term = new Terminal();

  useEffect(() => {
    term.options.fontSize = 40;
    var fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.open(terminalElement.current as HTMLDivElement);

    term.onKey((event: { key: string; domEvent: KeyboardEvent }) => {
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

          if (responseMessage !== "") {
            response(currentLine);
          } else {
            submit(currentLine);
          }

          currentLine = "";
          break;
        default:
          currentLine += key;
          break;
      }

      if (isCommand) {
        return;
      }

      const keyFromHandler = KeyHandlers.find(
        (x) => x.key === key.toLowerCase()
      );

      if (keyFromHandler !== undefined) {
        if (keyFromHandler.chars !== undefined) {
          return term.write(keyFromHandler.chars);
        }

        if (keyFromHandler.callback !== undefined) {
          return keyFromHandler.callback(term);
        }
      }

      return term.write(key);
    });
  }, []);

  return <div ref={terminalElement}></div>;
};

export default XTerm;
