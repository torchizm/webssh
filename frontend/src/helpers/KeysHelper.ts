import { Terminal } from "xterm";

const DisabledKeys : string[] = [
  "tab",
  "ctrl+x",
  "arrowup",
  "arrowright",
  "arrowdown",
  "arrowleft",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
  "f12",
  "insert",
  "delete",
  "home",
  "end",
  "pageup",
  "pagedown",
]

const KeyHandlers: {key: string, chars?: string, callback?: any}[] = [
  {
    key: "enter",
    chars: "\r\n",
  },
  {
    key: "backspace",
    chars: "\b \b",
  },
  {
    key: "ctrl+backspace",
    chars: "\x1b[2K\r",
  },
  {
    key: "ctrl+c",
    callback: (terminal: Terminal) => {
      navigator.clipboard.writeText(terminal.getSelection());
    }
  },
  {
    key: "ctrl+v",
    callback: (terminal: Terminal) => {
      if (terminal.hasSelection()) {
        navigator.clipboard.readText().then(text => {
          terminal.write(text);
        });
      }
    }
  }
];

export { KeyHandlers, DisabledKeys };