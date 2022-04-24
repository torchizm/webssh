import React, { Component, FunctionComponent, useEffect, useRef } from "react";
import { IDisposable, Terminal } from "xterm";

import "xterm/css/xterm.css";

type Props = {
  terminal: Terminal;
  enabled: boolean;
  onKey: (event: { key: string; domEvent: KeyboardEvent }) => void;
};

const XTermInner: FunctionComponent<Props> = ({ terminal, onKey, enabled }) => {
  useEffect(() => {
    if (enabled) {
      let event: IDisposable;

      if (enabled) {
        console.log("lkshdgsdh");
        event = terminal.onKey(onKey);
      }

      return () => {
        event.dispose();
      };
    }
  }, [enabled]);

  return <div></div>;
};

export default XTermInner;
