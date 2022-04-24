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

app.get("/", (req, res) => {
  return res.json({
    message: "pong!",
  });
});

io.on("connection", (socket) => {
  console.log(`Socket connected from ${socket}`);
  console.log(`Waiting ssh hostname`);

  socket.on("connectToSsh", () => {});
});

server.listen(process.env.PORT || 80, () => {
  console.log("App listening on port " + process.env.PORT);
});
