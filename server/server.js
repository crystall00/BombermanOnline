const express = require('express');
var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const parentDir = path.normalize(__dirname + "/..");
const welcomeMessage = "Hi, welcome to Bomberman Online! Please follow the chat rules! 😄";

var User = require('./game').User;
var Room = require('./game').Room;
var RoomList = require('./game').RoomList;

var room = new Room('waiting room');
var userCount = 0;
var roomCount = 0;

app.use(express.static(parentDir + '/client'));

http.listen(3002, function () {
    console.log('listening on *:3002');
});

io.on('connect', onConnect);

function onConnect(socket) {
    let roomList = new RoomList();
    let playerPosition;
    let playerFigure;
    let roomName;
    userCount++;
    socket.emit('botMessage', welcomeMessage);

    switch (userCount % 4) {
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
    let user = new User(socket.id.trim(), userCount, "Player " + userCount, playerPosition, playerFigure, true);
    if (room.users.length % 4 === 0) {
        roomCount++;
        roomName = 'Room #' + roomCount;
        room = new Room(roomName);
        roomList.addRoom(room);
        console.log("Added room to Room List. Rooms: " + roomList.rooms.length + "Room called: " + roomList.rooms[0].name);
    }
    socket.join(room.name, () => {
        room.addUser(user);
        let rooms = Object.keys(socket.rooms);
        user.room = rooms[1];
        socket.emit('passIdentity', user);

        let message = user.name + ' joined ' + user.room + '. Total user count: ' + room.users.length;
        let botMessage = user.name + ' joined the party!';

        socket.to(user.room).emit('botMessage', botMessage);
        console.log(message);
    });

    socket.on('disconnecting', function (socket) {
        let self = this;
        let rooms = Object.keys(self.rooms);
        let roomName = rooms[1];

        console.log("Looking for room name: " + rooms[1] + roomList.rooms.length + "There is a Room called: " + roomList.rooms[0].name);

        let room = roomList.rooms.find(function (element) {
            return element.name === roomName;
        });

        console.log("Looking for socket-id: " + self.id.trim());
        console.log("Currently following socket-ids available: ");

        for(var i = 0; i < room.users.length; i++){
            console.log("Socket-id: " + room.users[i]);
        }

        console.log("Leaving " + roomName);
        let user = room.users.find(function (element) {
            return element.socketId === self.id.trim();
        });

        room.removeUser(user);
        userCount--;

        if (room.users.length === 0) {
            roomList.removeRoom(room);
            roomCount--;
        }

        let message = 'User ' + user.name + ' left ' + room.name + '. Total user count: ' + room.users.length;
        io.in(room.name).emit('botMessage', message);
        console.log(message);
    });

    socket.on('chatMessage', function (msg) {
        console.log('Player #' + msg.from.id + ' sent a message. Message: ' + '"' + msg.message + '"');
        io.sockets.emit('broadcast', msg);
    });

    socket.on('clientPosition', function (msg) {
        console.log(msg.from.figure + " wants to move " + msg.message);
        io.in(room.name).emit('updatePosition', 'the game will start soon');
        io.sockets.emit('updatePosition', msg);
    });
}

