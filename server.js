const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

const Chats = require("./msgSchema");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/messages");

http.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});

app.use(express.static(__dirname + "/backend"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket.io

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("connected..");
  Chats.find().then((result) => {
    console.log(result);
    socket.emit("receive chat", result);
  });

  socket.on("message", (msg) => {
    const newMessage = new Chats({ username: msg.user, message: msg.message });
    newMessage.save().then(() => {
      socket.broadcast.emit("message", msg);
    });
  });

  socket.on("typing", (name) => {
    // console.log(name);
    socket.broadcast.emit("typing", name);
  });
});
