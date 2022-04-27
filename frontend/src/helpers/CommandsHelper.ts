import { Terminal } from "xterm";
import Credentials from "./Credentials";

const CommandsHelper: { command: string; callback?: any }[] = [
  {
    command: "clear",
    callback: (terminal: Terminal) => {
      terminal.clear();
    },
  },
  {
    command: "exit",
    callback: (terminal: Terminal) => {
      location.reload();
    },
  },
];

const isCommand = (command: string) =>
  CommandsHelper.find((x) => x.command === command) !== undefined;

export { CommandsHelper, isCommand };
