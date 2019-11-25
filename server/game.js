const CAT_IMG = "assets/player/icons/cat_ico_50x50.png";
const GORILLA_IMG = "assets/player/icons/gorilla_ico_50x50.png";
const PENGUIN_IMG = "assets/player/icons/penguin_ico_50x50.png";
const RABBIT_IMG = "assets/player/icons/rabbit_ico_50x50.png";

function User(id) {
    this.id = id;
    if (id % 4 === 1) {
        this.avatar = CAT_IMG;
    } else if (id % 4 === 2) {
        this.avatar = GORILLA_IMG;
    } else if (id % 4 === 3) {
        this.avatar = PENGUIN_IMG;
    } else{
        this.avatar = RABBIT_IMG;
    }

    /*
    // assign a random number to User.
    // Long enough to make duplication chance less.
        this.id = "1" + Math.floor(Math.random() * 1000000000);
     */
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