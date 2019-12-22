const websocketGame = {};
var myself;

$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("connected to server");
    });

    websocketGame.socket.on('passIdentity', function (identity) {
        myself = identity;
        requestField();
    });

    websocketGame.socket.on('broadcast', function (msg) {
        if (msg.from.id === myself.id) {
            appendMessage('Player ' + myself.id, myself.imgPath, "right", msg.message);
        } else {
            appendMessage('Player ' + msg.from.id, msg.from.imgPath, "left", msg.message);
        }
    });

    websocketGame.socket.on('loadField', function (msg) {
        loadField(msg);
    });

    websocketGame.socket.on('botMessage', function (msg) {
        botResponse(msg);
    });

    websocketGame.socket.on('confirmPosition', function (msg) {
        move(msg.from, msg.message);
    });

    websocketGame.socket.on('confirmBombDrop', function (msg) {
        layBomb(msg.from.position);
    });

    websocketGame.socket.on('updatePlayerPositions', function (msg) {
        for (let i = 0; i < msg.users.length; i++) {
            let position = msg.users[i].position;
            switch (msg.users[i].figure) {
                case "cat":
                    $("#cat").appendTo($("#" + position.y + "_" + position.x));
                    break;
                case "gorilla":
                    $("#gorilla").appendTo($("#" + position.y + "_" + position.x));
                    break;
                case "penguin":
                    $("#penguin").appendTo($("#" + position.y + "_" + position.x));
                    break;
                case "rabbit":
                    $("#rabbit").appendTo($("#" + position.y + "_" + position.x));
                    break;
                default:
                    break;
            }
        }
    });
});

function requestNewPosition(me, direction) {
    websocketGame.socket.emit('requestPosition', new Message(me, direction));
}

function requestBombDrop(me) {
    websocketGame.socket.emit('requestBombDrop', new Message(me, ""));
}

function requestField() {
    websocketGame.socket.emit('requestField', new Message(myself, ""));
}

function loadField(field) {
    console.log(JSON.stringify(field));
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            if (field[i][j] === 1) {
                let searchID = "#" + i + "_" + j;
                console.log("adding ice to: " + searchID);
                $(searchID).addClass('ice');
            }
        }
    }
}

function fieldUpdate(X, Y) {
    websocketGame.socket.emit('fieldUpdate', new Position(myself, X, Y));
}