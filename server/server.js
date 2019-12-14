const express = require('express');
var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const parentDir = path.normalize(__dirname + "/..");
const welcomeMessage = "Hi, welcome to Bomberman Online! Please follow the chat rules! 😄";
let positionA;
let positionB;
let positionC;
let positionD;

var User = require('./game').User;
var Room = require('./game').Room;

var room = new Room('waiting room');
var userId = 0;
var roomCount = 0;

app.use(express.static(parentDir + '/client'));

http.listen(3002, function () {
    console.log('listening on *:3002');
});

io.on('connect', onConnect);

function onConnect(socket) {
    let playerPosition;
    let playerFigure;
    userId++;
    socket.emit('botMessage', welcomeMessage);

    switch (userId % 4) {
        case 1:
            playerPosition = {x: 1, y: 1};
            playerFigure = "cat";
            break;
        case 2:
            playerPosition = {x: 13, y: 1};
            playerFigure = "gorilla";
            break;
        case 3:
            playerPosition = {x: 1, y: 13};
            playerFigure = "penguin";
            break;
        case 0:
            playerPosition = {x: 13, y: 13};
            playerFigure = "rabbit";
            break;
        default:
            break;
    }
    let user = new User(userId, playerPosition, playerFigure);
    let roomName;
    if (room.users.length % 4 === 0) {
        roomCount++;
        roomName = 'Room #' + roomCount;
        room = new Room(roomName);
    }
    socket.emit('passIdentity', user);
    socket.join(room.name);
    room.addUser(user);
    let message = 'Player ' + user.id + ' joined ' + room.name + '. Total user count: ' + room.users.length;
    let botMessage = 'Player ' + user.id + ' joined the party!';
    socket.broadcast.emit('botMessage', botMessage);
    console.log(message);
    socket.on('disconnect', function (socket) {
        userId--;
        room.removeUser(user);
        let message = 'User ' + user.id + ' left ' + room.name + '. Total user count: ' + room.users.length;
        room.sendAll(io, message, socket, room);
        console.log(message);
    });

    socket.on('chatMessage', function (msg) {
        console.log('Player #' + msg.from.id + ' sent a message. Message: ' + '"' + msg.message + '"');
        io.sockets.emit('broadcast', msg);
    });

    socket.on('myPosition', function(msg){
        console.log("Moved to: ", msg);
        if(msg.name === 'playerA'){
            positionA = msg.position;
        }
    })
}



