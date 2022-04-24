import { FunctionComponent, useEffect, useRef, useState } from "react";

import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { DisabledKeys, KeyHandlers } from "../helpers/KeysHelper";
import { CommandsHelper } from "../helpers/CommandsHelper";
import XTermInner from "./XTermInner";

type Props = {
  submit: (cmd: string) => void;
  responseMessage: string;
  response: (message: string) => void;
  canType: boolean;
};

const XTerm: FunctionComponent<Props> = ({
  submit,
  responseMessage,
  canType,
  response,
}) => {
  const [enabled, setEnabled] = useState<boolean>(canType);
  const terminalElement = useRef<HTMLDivElement>(null);

  let currentLine: string = "";
  var term = new Terminal();

  useEffect(() => {
    term.options.fontSize = 40;
    var fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.open(terminalElement.current as HTMLDivElement);
  }, []);

  useEffect(() => {
    console.log("cantype değişti aga", canType);
    console.log("enabele değişti aga", enabled);

    setTimeout(() => {
      setEnabled(canType);
    }, 1000);
  }, [canType]);

  const onKey = (event: { key: string; domEvent: KeyboardEvent }) => {
    let key: string = event.domEvent.key;

    if (DisabledKeys.includes(key.toLowerCase())) {
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
        submit(currentLine);

        currentLine = "";
        break;
      default:
        currentLine += key;
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

  const handleOnKey = (event: { key: string; domEvent: KeyboardEvent }) => {
    console.log(enabled);
    console.log(event.key);
  };

  return (
    <>
      <div ref={terminalElement}></div>
      <XTermInner terminal={term} onKey={handleOnKey} enabled={enabled} />
    </>
  );
};

export default XTerm;
