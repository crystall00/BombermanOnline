const CAT_IMG = "assets/player/icons/cat_ico_50x50.png";
const GORILLA_IMG = "assets/player/icons/gorilla_ico_50x50.png";
const PENGUIN_IMG = "assets/player/icons/penguin_ico_50x50.png";
const RABBIT_IMG = "assets/player/icons/rabbit_ico_50x50.png";

function User(socketId, id, name, position, figure, alive) {
    this.socketId = socketId;
    this.id = id;
    this.name = name;
    this.position = position;
    this.figure = figure;
    this.alive = alive;
    switch (figure) {
        case "cat":
            this.imgPath = CAT_IMG;
            break;
        case "gorilla":
            this.imgPath = GORILLA_IMG;
            break;
        case "penguin":
            this.imgPath = PENGUIN_IMG;
            break;
        case "rabbit":
            this.imgPath = RABBIT_IMG;
            break;
        default:
            break;
    }
}

function Room(name) {
    this.name = name;
    this.users = [];
}

Room.prototype.addUser = function (user) {
    this.users.push(user);
};

Room.prototype.removeUser = function (user) {
    for (var i = this.users.length; i >= 0; i--) {
        if (this.users[i] === user) {
            this.users.splice(i, 1);
        }
    }
};

Room.prototype.sendAll = function (io, message, socket, room) {
    //  io.in(room.name).emit('big-announcement', 'the game will start soon');
    io.to(room.name).emit(message);
};

module.exports.User = User;
module.exports.Room = Room;