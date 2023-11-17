const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const socketio = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const { instrument } = require("@socket.io/admin-ui");
const { v4: uuidv4 } = require('uuid');
const Storage = require('./store');


const Store = new Storage();
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
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = Storage.findSession(sessionID);
      if (session) {
        if(socket.handshake.auth.username != session.username)
        {
          return next(new Error("Invalid Username"))
        }
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }


    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    socket.username = username;
    Storage.saveSession(socket.sessionID , socket);
    return next();
});


io.on('connection', async (socket) => {

    socket.join(socket.userID);

    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID
    });

    const users = [];
    let existingUsers = Storage.findAllSession();

    for (let socket of existingUsers) {
      users.push({
        userID: socket.userID,
        username: socket.username,
      });
    }

    // socket.onAny((event, ...args) => {
    //     console.log(event, args);
    // });

    io.emit("users", users);

    // socket.on("connect_error", (err) => {
    //     // if (err.message === "invalid username") {
    //     //   this.usernameAlreadySelected = false;
    //     // }
    //   });

    socket.on('some-event', (msg, id, idr) => {
      try{
        socket.to(idr).emit('some-event', msg, id, idr);
        socket.emit('some-event', msg, id, idr);
        // socket.to(id).emit('some-event', msg, id, id)
      }
      catch(error){
        console.log("Error", error);
      }
        
    })
})

instrument(io, {
  auth: false
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});

