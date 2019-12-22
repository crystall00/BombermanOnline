const CAT_IMG = "assets/player/icons/cat_ico_50x50.png";
const GORILLA_IMG = "assets/player/icons/gorilla_ico_50x50.png";
const PENGUIN_IMG = "assets/player/icons/penguin_ico_50x50.png";
const RABBIT_IMG = "assets/player/icons/rabbit_ico_50x50.png";

function User(socketId, id, name, position, figure, alive, room) {
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

User.prototype.assignToRoom = function (room) {
    this.room = room;
};

function Room(name) {
    this.name = name;
    this.users = [];
    let someField = new PlayingField();
    //console.log("######################## JSON 1" + JSON.stringify(someField));
    someField.create2DimField();
    //console.log("######################## JSON 2" + JSON.stringify(someField));
    someField.initialize();
    //console.log("######################## JSON 3" + JSON.stringify(someField));
    this.field = someField.field;
}

function PlayingField() {

}

PlayingField.prototype.create2DimField = function () {
    this.field = new Array(15);
    for (let i = 0; i < this.field.length; i++) {
        this.field[i] = new Array(15);
    }
};

PlayingField.prototype.initialize = function () {
    for (let i = 1; i < this.field.length; i++) {
        for (let j = 1; j < this.field[0].length; j++) {
            if (!((i === 0 || i === 14) || ((j === 0 || j === 14) && (i !== 0 || i !== 14)) || ((i % 2 === 0 && j % 2 === 0)) || ((i < 3 || i > 11) && (j < 3 || j > 11)))) {
                this.field[i][j] = 1;
            } else {
                this.field[i][j] = 0;
            }
        }
    }
};


Room.prototype.addUser = function (user) {
    this.users.push(user);
};

Room.prototype.removeUser = function (user) {
    for (let i = this.users.length; i >= 0; i--) {
        if (this.users[i] === user) {
            this.users.splice(i, 1);
        }
    }
};

function RoomList() {
    this.rooms = [];
}

RoomList.prototype.addRoom = function (room) {
    this.rooms.push(room);
};

RoomList.prototype.removeRoom = function (room) {
    for (var i = this.rooms.length; i >= 0; i--) {
        if (this.rooms[i] === room) {
            this.rooms.splice(i, 1);
        }
    }
};

RoomList.prototype.getRoom = function (roomName) {
    return this.rooms.find(function (element) {
        return element.name === roomName;
    });
};

module.exports.User = User;
module.exports.Room = Room;
module.exports.RoomList = RoomList;