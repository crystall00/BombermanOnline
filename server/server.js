const express = require('express');
var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const parentDir = path.normalize(__dirname + "/..");

var User = require('./game').User;
var Room = require('./game').Room;
var room1 = new Room('game');

app.use(express.static(parentDir + '/client'));

http.listen(3002, function () {
    console.log('listening on *:3002');
});

io.on('connect', onConnect);

function onConnect(socket) {
    let user = new User(socket);
    socket.join('game');
    room1.addUser(user);
    console.log('a user connected');
    let message = "Welcome " + user.id + " joining the party. Total connection: " + room1.users.length;
    room1.sendAll(io,message,socket,'game');
    console.log(message);
    socket.on('message', function (msg) {
        console.log('Message received!');
        io.sockets.emit('broadcast', msg + ' from ' + socket.id);
    });
}

