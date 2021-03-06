const express = require('express');
var app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const parentDir = path.normalize(__dirname + "/..");
const welcomeMessage = "Hi, welcome to Bomberman Online 😄 ! Please follow the chat rules!";
const cacheTime = 86400000 * 30;

var User = require('./game').User;
var Room = require('./game').Room;
var RoomList = require('./game').RoomList;

var roomList = new RoomList();
var room = new Room("");
var userCount = 0;
var roomCount = 0;
var availableCharacters = [1, 1, 1, 1];

//app.use(express.static(parentDir + '/client'));

app.use(express.static(path.join(parentDir, 'client'), {
    maxAge: cacheTime
}));

http.listen(3002, function () {
    console.log('listening on *:3002');
});

io.on('connect', onConnect);

function onConnect(socket) {
    socket.emit('availableCharacters', availableCharacters);
    let playerPosition;
    let playerFigure;
    let roomName;
    userCount++;
    socket.emit('botMessage', welcomeMessage);

    socket.on('charSelection', function (figure) {
        switch (figure) {
            case "cat":
                playerPosition = {x: 1, y: 1};
                playerFigure = "cat";
                availableCharacters[0] = 0;
                break;
            case "gorilla":
                playerPosition = {x: 13, y: 1};
                playerFigure = "gorilla";
                availableCharacters[1] = 0;
                break;
            case "penguin":
                playerPosition = {x: 1, y: 13};
                playerFigure = "penguin";
                availableCharacters[2] = 0;
                break;
            case "rabbit":
                availableCharacters[3] = 0;
                playerPosition = {x: 13, y: 13};
                playerFigure = "rabbit";
                break;
            default:
                break;
        }
        let user = new User(socket.id.trim(), userCount, "Player " + playerFigure, playerPosition, playerFigure, false);
        if (room.users.length % 4 === 0) {
            roomCount++;
            roomName = 'Room #' + roomCount;
            room = new Room(roomName);
            roomList.addRoom(room);
        }
        socket.join(room.name, () => {
            room.addUser(user);
            let rooms = Object.keys(socket.rooms);
            user.assignToRoom(room.name);
            socket.emit('passIdentity', user);
            //socket.emit('updatePlayer', room);
            let message = user.name + ' joined ' + user.room + '. Total user count: ' + room.users.length;
            if (room.users.length === 4) {
                availableCharacters = [1, 1, 1, 1];
                io.in(room.name).emit('startGame', "");
                for (let i = 0; i < room.users.length; i++) {
                    room.users[i].alive = true;
                }
            }
            console.log("Available characters: " + availableCharacters);
            io.in(room.name).emit('availableCharacters', availableCharacters);
            console.log(message);
        });
        //io.in(player.room).emit('updatePlayer', player);
    });

    socket.on('disconnecting', function (socket) {
        let self = this;
        let rooms = Object.keys(self.rooms);
        let roomName = rooms[1];

        let room = roomList.getRoom(roomName);
        if (typeof room !== "undefined") {
            let user = room.users.find(function (element) {
                return element.socketId === self.id.trim();
            });

            console.log(user.name + " left " + room.name);
            room.removeUser(user);
            userCount--;
            let message = 'User ' + user.name + ' left ' + room.name + 'Total user count: ' + room.users.length;
            io.in(room.name).emit('botMessage', message);
            console.log(message);
            if (room.users.length === 0) {
                roomList.removeRoom(room);
                roomCount--;
            }
        }
    });

    socket.on('requestField', function (msg) {
        let self = this;
        let rooms = Object.keys(self.rooms);
        let roomName = rooms[1];
        let room = roomList.getRoom(roomName);
        io.in(msg.from.room).emit('loadField', room.field);
    });

    socket.on('chatMessage', function (msg) {
        console.log('Player #' + msg.from.id + ' sent a message. Message: ' + '"' + msg.message + '"');
        io.sockets.emit('broadcast', msg);
    });

    socket.on('requestPosition', function (msg) {

        switch (msg.message) {
            case "left":
                msg.from.position.x--;
                break;
            case "right":
                msg.from.position.x++;
                break;
            case "up":
                msg.from.position.y--;
                break;
            case "down":
                msg.from.position.y++;
                break;
            default:
                break;
        }
        console.log(msg.from.figure + " moving " + msg.message + " to position: #" + msg.from.position.x + "_" + msg.from.position.y);
        io.in(msg.from.room).emit('confirmPosition', msg);
    });

    socket.on('requestBombDrop', function (msg) {
        console.log(msg.from.figure + " dropping bomb at #" + msg.from.position.x + "_" + msg.from.position.y);
        io.in(msg.from.room).emit('confirmBombDrop', msg);
    });

    socket.on('fieldUpdate', function (msg) {
        let self = this;
        let rooms = Object.keys(self.rooms);
        let roomName = rooms[1];
        let room = roomList.getRoom(roomName);
        room.field[msg.X][msg.Y] = 0;
    });
    socket.on('updatePlayer', function (player) {
        let self = this;
        let rooms = Object.keys(self.rooms);
        let roomName = rooms[1];
        console.log("############## Room Name: " + roomName);
        let room = roomList.getRoom(roomName);
        let user = room.users.find(function (element) {
            return element.socketId === self.id.trim();
        });
        console.log("Player '" + user.name + "' is no more alive.");
        user.alive = false;
        let position = room.users.indexOf(user);
        console.log("The position is: " + position);
        room.users[position].alive = false;
        console.log(JSON.stringify(user) + " lost the game!");
        io.in(player.room).emit('updatePlayer', player);
        let usersAlive = 0;
        let userAlive = '';
        for (let i = 0; i < room.users.length; i++) {
            console.log(room.users[i].alive);
            if (room.users[i].alive) {
                usersAlive++;
                userAlive = room.users[i].figure;
            }
        }
        console.log("Currently alive: " + usersAlive);

        if (usersAlive === 1) {
            let message = userAlive + " has won the game!";
            io.in(player.room).emit('botMessage', message);
            io.in(player.room).emit('playerWon', userAlive);
        }

    });

    socket.on('playerReset', function (player) {
        switch (player.figure) {
            case "cat":
                player.position.x = 3;
                player.position.y = 3;
                break;
            case "gorilla":
                player.position.x = 11;
                player.position.y = 3;
                break;
            case "penguin":
                player.position.x = 3;
                player.position.y = 11;
                break;
            case "rabbit":
                player.position.x = 11;
                player.position.y = 11;
                break;
            default:
                break;
        }
        io.in(player.room).emit('mediumReset', player);
    });
}

