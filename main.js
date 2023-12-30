const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const socketio = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const { instrument } = require("@socket.io/admin-ui");
const { v4: uuidv4 } = require('uuid');
const routes = require('./routing/routefile');
const Storage = require('./store');
const Database = require("./database");
const {saveNewUser, findUserWithSessionID, findAllUsers, findUserWithUserID, setDisconnection, setReConnection} = require("./Query/userquery");
const {findSavedUserByUserID, saveNewUserInfo, fetchUsersDetails} = require("./Query/saveduserquery");
const bodyParser = require('body-parser')
const SavedUser = require("./DataModels/saveduser");
const User = require("./DataModels/user");
const { validityCheckForExistingUsers, addUserFunction, addMessageFunction } = require('./Controller/controller');
const Message = require('./DataModels/messages');

const Store = new Storage();
const app = express();
const server = createServer(app,);
const io = new socketio.Server(server,{
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  },
  connectionStateRecovery: {},
  credentials: true
});

Database.sync();


app.use(cors({
  origin: "*"
}))

app.use(bodyParser.json());

app.use(routes);

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


io.use(async(socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    //case where session id exisits in local storage
    if (sessionID) {
      let session = await findUserWithSessionID(sessionID);

      let result = await setReConnection(sessionID)

      if (session) {
        if(socket.handshake.auth.username != session.username)
        {
          return next(new Error("Invalid Username"))
        }
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        socket.connected = true;
        return next();
      }
    }

    //case when new user is trying to connect with socket.connect
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error("invalid username"));
    }
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    socket.username = username;
    socket.connected = true;
    //new used is created in database
    const res = await saveNewUser(socket.username, socket.sessionID, socket.userID, socket.connected);
    return next();
});



io.on('connection', async (socket) => {
  //to check if the socket connection is exists in database or not if it not then create new entry in savedUser database  
    if(!await findSavedUserByUserID(socket.userID)){
      await saveNewUserInfo(socket.sessionID, socket.userID, socket.username, true);
    } 

    socket.join(socket.userID);

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    socket.emit('session', {
      sessionID: socket.sessionID,
      userID: socket.userID,
      isConnected: socket.connected,
      user: {
        userID: socket.userID,
        username: socket.username,
      }
    });

    // const users = [];
    // let existingUsers = Storage.findAllSession();

    // for (let socket of existingUsers) {
    //   users.push({
    //     userID: socket.userID,
    //     username: socket.username,
    //     isConnected: socket.connected
    //   });
    // }
    socket.on('add-user-req', async(id, cb) => {
      // let user = Storage.findUserToAdd(id);

      let user = await findUserWithUserID(id);

      let messageObj = {};
      if(user){
        messageObj.message='User found!',
        messageObj.user = {
          userID: user.userID,
          username: user.username,
        };
        cb('successful');
      }
      else{
        messageObj.message = 'User not found!'
        cb('not found'); 
      }

      socket.emit('add-user', messageObj);
    });

    socket.on('add-user-req2', async(id, cb) => {
      // let user = Storage.findUserToAdd(id);
      let user = await findUserWithUserID(id);

      let messageObj = {};
      if(user){
        messageObj.message='User found!',
        messageObj.user = {
          userID: user.userID,
          username: user.username,
        };
        cb(messageObj);
      }
      else{
        messageObj.message = 'User not found!'
        cb(messageObj); 
      }
    });

    // socket.on("connect_error", (err) => {
    //     // if (err.message === "invalid username") {
    //     //   this.usernameAlreadySelected = false;
    //     // }
    //   });

    socket.on('some-event', async(msg, id, idr) => {
      try{
        socket.to(idr).emit('some-event', msg, id, idr);
        //handling adding of message in the database 
        let messageobj = {
          message: msg,
          self: true
        };
        //for the user who send the message
        addMessageFunction(id, idr, messageobj);
        let newMessageObj = {
          ...messageobj
        };
        newMessageObj.self = !newMessageObj.self
        //for the user whom the message was sent
        addMessageFunction(idr, id, newMessageObj);
        //handling adding of user to whom the message supposed to be send
        let user = await findUserWithUserID(id);
        let existingUsers = await fetchUsersDetails(idr);
        let newUser = {
          userID: user.userID,
          username: user.username,
          self: false,
          name: ''
        }

        if(!validityCheckForExistingUsers(id, existingUsers)){
          addUserFunction(idr, newUser);
        }

        socket.emit('some-event', msg, id, idr);
        // socket.to(id).emit('some-event', msg, id, id)
      }
      catch(error){
        console.log("Error", error);
      }
        
    });

    socket.on('disconnection-handler', (cb)=> {
      setDisconnection(socket.sessionID)
      .then(res => {
        if(res){
          cb('successful');
          socket.emit('disconnection-handler');
        }
      })
      // Storage.setDisconnection(socket.sessionID);

    })
});

instrument(io, {
  auth: false
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});

