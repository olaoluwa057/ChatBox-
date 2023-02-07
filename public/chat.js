// Make connection
const socket = io.connect("http://localhost:4000");
// const mongosse = mongosse.connect('http://localhost:4000')
// const ChatModel = require("./models/chat")

// Query DOM
const message = document.getElementById("message");
const sender = document.getElementById("handle");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const feedback = document.getElementById("feedback");

/// Emmit events

btn.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    sender: handle.value,
  });

  message.value = "";
});

message.addEventListener("keypress", function () {
  socket.emit("typing", sender.value);
});

/// listen for events

socket.on("chat", function (data) {
  feedback.innerHTML = "";
  output.innerHTML +=
    "<p><strong>" + data.sender + ":</strong>" + data.message + "</p>";
});

socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message.. </em> </p>";
});
