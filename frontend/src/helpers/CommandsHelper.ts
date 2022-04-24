import { Terminal } from "xterm";

const CommandsHelper: {command: string, callback?: any}[] = [
  { 
    command: "clear",
    callback: (terminal: Terminal) => {
      terminal.clear();
    }
  }
];

const isCommand = (command: string) => CommandsHelper.find(x => x.command === command) !== undefined;

export { CommandsHelper, isCommand };