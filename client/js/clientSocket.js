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
        if (msg.from.figure === myself.figure) {
            appendMessage(myself.figure, myself.imgPath, "right", msg.message);
        } else {
            appendMessage(msg.from.figure, msg.from.imgPath, "left", msg.message);
        }
    });

    websocketGame.socket.on('loadField', function (msg) {
        loadField(msg);
    });

    websocketGame.socket.on('botMessage', function (msg) {
        botResponse(msg);
    });

    websocketGame.socket.on('confirmPosition', function (msg) {
        if (myself.figure === msg.from.figure)
            myself.position = msg.from.position;
        move(msg.from, msg.message);
    });

    websocketGame.socket.on('confirmBombDrop', function (msg) {
        layBomb(msg.from.position);
    });

    websocketGame.socket.on('updatePlayer', function (player) {
        console.log(player.figure + " lost! Removing the player from field.");
        loseAnimation(player.figure);
    });

    websocketGame.socket.on('availableCharacters', function (availableCharacters) {
        loadCharacterSelection(availableCharacters);
    });

    websocketGame.socket.on('startGame', function () {
        startGame();
    });

    websocketGame.socket.on('mediumReset', function (player) {
        if (myself.figure === player.figure) {
            myself = player;
            console.log(myself.figure + " new position is: " + myself.position.x + "_" + myself.position.y);
        }
        mediumReset(player);
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



function fieldUpdate(X, Y) {
    websocketGame.socket.emit('fieldUpdate', new Position(myself, X, Y));
}

function playerLost() {
    websocketGame.socket.emit('updatePlayer', myself);
}

function sendSelection(figure) {
    websocketGame.socket.emit('charSelection', figure);
}

function requestPlayerReset() {
    websocketGame.socket.emit('playerReset', myself);
}