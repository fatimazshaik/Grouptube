//rewrite css
//remove more video aspect
//modify chatbot

//express = framework/library used for web server
const express = require('express')//call library use keyword require; creates object express
var app = express(); //define application to be express based
const path = require('path') //OS library -> determine path
const PORT = process.env.PORT || 5000 //Port; entry point to get to app
const http = require('http').Server(app) //creates http server using express app
const io = require('socket.io')(http) ///scoket.io = web socket library

app.use(express.static(path.join(__dirname, 'public'))) //take public and make it a useable static asset
app.set('views', path.join(__dirname, 'views')) //setting where views are located
app.set('view engine', 'ejs') //setting view engine --> type of html using 
app.get('/', (req, res) => res.render('index')) // app.get --> when get request on root path creates a connetcion with request and response => render index fiel
http.listen(PORT, () => console.log(`Listening on ${ PORT }`)) //intialize server

var numUsers = 0; //number of user

io.on('connection', function(socket){
  var addedUser = false;

  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('play', function(){
    console.log("Play.");
    io.emit('play', );
  });
  socket.on('pause', function(){
    console.log("Pause.");
    io.emit('pause', );
  });

  socket.on('seek', function(time){
    console.log("Pause.");
    io.emit('seek', time);
  });

  socket.on('changeVideo', function(videoId){
    console.log("Change Video.");
    io.emit('changeVideo', videoId);
  });

  socket.on('newMessage', (data) => {
    console.log("printing a new message");
    socket.broadcast.emit('newMessage', {
      username: socket.username,
      message: data
    });
  });

  socket.on('addUser', (username) => {
    if (addedUser) return;
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    socket.broadcast.emit('userJoin', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      socket.broadcast.emit('userLeft', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});