const express = require('express');
var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const parentDir = path.normalize(__dirname + "/..");
var roomCount = 0;

var User = require('./game').User;
var Room = require('./game').Room;

var room = new Room('');
var id = 0;

app.use(express.static(parentDir + '/client'));

http.listen(3002, function () {
    console.log('listening on *:3002');
});

io.on('connect', onConnect);

function onConnect(socket) {
    id++;
    let user = new User(socket, id);
    let roomName;
    if(room.users.length % 4 === 0){
        roomCount++;
        roomName = 'Room #' + roomCount;
        room = new Room(roomName);
    }
    socket.join(roomName);
    room.addUser(user);
    console.log('a user connected');
    let message = user.id + " joined the party. Total user count: " + room.users.length;
    room.sendAll(io,message,socket,roomName);
    console.log(message);
    socket.on('message', function (msg) {
        console.log('Message received!');
        io.sockets.emit('broadcast', msg + ' from ' + socket.id);
    });
}

