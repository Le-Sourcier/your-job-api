const socketIo = require("socket.io");

const http = require("http");
const express = require("express");
const app = express(http);
const server = http.createServer(app);

const route = express.Router();

const io = socketIo(server);

io.on("connection", (socket) => {
  const successMessage = "User connected";
  console.log(successMessage);
  // socket.broadcast.emit("connected");
  socket.emit("connection", successMessage);

  // socket.on("message", async (query) => {
  //   Model.getUserData(query, socket).catch((error) => {
  //     console.log(error);
  //     socket.emit("message", error);
  //   });
  // });

  socket.on("disconnect", () => {
    //socket.emit("disconnect");
    const errorMessage = "User disconnected";
    console.log(errorMessage);
    // socket.emit("disconnect", errorMessage);
  });
});

module.exports = route;
