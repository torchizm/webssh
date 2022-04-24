import React, { FunctionComponent } from "react";
import "./Notification.css";

type types = {
  text: string;
};

const Notification: FunctionComponent<types> = ({ text }) => {
  return (
    <div className="notification">
      <span>{text}</span>
    </div>
  );
};

export default Notification;
