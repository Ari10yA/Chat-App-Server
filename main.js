const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const socketio = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const server = createServer(app,);
const io = new socketio.Server(server,{
  cors: {
    origin: '*'
  },
  connectionStateRecovery: {},
  credentials: true
});

app.use(cors({
  origin: "*"
}))

app.use(session({
    secret: 'my-super-secret',
    resave: false,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    if(!req.session.user){
        req.session.user = "New User"
    }
    req.user = req.session.user;
    next();
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
});


io.on('connection', (socket) => {

    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    io.emit("users", users);

    socket.on("connect_error", (err) => {
        // if (err.message === "invalid username") {
        //   this.usernameAlreadySelected = false;
        // }
      });

    socket.on('some-event', (msg) => {
        console.log(msg);
        io.emit('some-event', msg);
    })
})

instrument(io, {
  auth: false
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});

