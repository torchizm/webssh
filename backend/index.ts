import { Request, Response } from "express";
import { Socket } from "socket.io";
import { Client as SshClient } from "ssh2";

const env = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

env.config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

let connections: number = 0;

app.get("/", (req: Request, res: Response) => {
  return res.json({
    message: `Server is running behind and ${connections} clients online`,
  });
});

io.on("connection", (socket: Socket) => {
  connections++;

  let conn: SshClient = new SshClient();

  socket.on("run", (cmd: string) => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        return;
      }

      stream
        .on("data", (data: any) => {
          socket.emit("write", data);
        })
        .stderr.on("data", (data: any) => {
          socket.emit("write", data);
        });
    });
  });

  socket.on(
    "connectToSsh",
    (data: {
      hostname: string;
      port: number;
      user: string;
      password: string;
    }) => {
      conn
        .on("ready", () => {
          socket.emit("setSshConnection", true);
        })
        .connect({
          host: data.hostname,
          port: data.port,
          username: data.user,
          password: data.password,
        });

      conn.on("disconnect", () => {
        socket.emit("setSshConnection", false);
      });
    }
  );

  socket.on("disconnect", () => {
    connections--;

    if (conn !== undefined) {
      conn.end();
      conn.destroy();
    }
  });
});

server.listen(process.env.PORT || 80, () => {
  console.log("App listening on port " + process.env.PORT);
});
