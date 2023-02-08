const express = require("express");
const socket = require("socket.io");
const mongosse = require("mongoose");
const ChatModel = require("./models/chat");
require('dotenv').config();

// App setup
const app = express();
const server = app.listen(4000);

/// connect to mongoDB
const dbURL = process.env.DB_HOST;

mongosse
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(server)
  .catch((err) => console.log(err));

// Static files
app.use(express.static("public"));

// Socket setup & pass server
const io = socket(server);
io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);

  ChatModel.find().limit(50)
  .exec((err, msg) => {
    socket.emit('chatHistory', msg)
   //console.log(msg, "message")
  })

  socket.on("chat", function (data) {
    io.sockets.emit("chat", data);

    const chat = new ChatModel(data);
    chat
      .save()
      .then(console.log(data, "data"))
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});
