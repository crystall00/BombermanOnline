const websocketGame = {};
var myself;

$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("Connected to server");
    });

    websocketGame.socket.on('passIdentity', function (identity) {
        myself = identity;
        console.log('Identity passed. My ID is: ' + myself.id);
        console.log('My Figure is: ' + myself.figure);
        console.log('My position is: ' + JSON.stringify(myself.position));
    });

    websocketGame.socket.on('broadcast', function (msg) {
        if (msg.from.id === myself.id) {
            appendMessage('Player ' + myself.id, myself.imgPath, "right", msg.message);
        } else {
            appendMessage('Player ' + msg.from.id, msg.from.imgPath, "left", msg.message);
        }
    });

    websocketGame.socket.on('botMessage', function (msg) {
        botResponse(msg);
    });

    websocketGame.socket.on('confirmPosition', function (msg) {
        console.log("Updating position... " + msg.from.figure + " moving " + msg.message);
        move(msg.from, msg.message);
    });

    websocketGame.socket.on('confirmBombDrop', function (msg) {
        console.log("Bomb drop by " + msg.from.figure);
        layBomb(msg.from.position);
    });
});

function requestNewPosition(me, direction) {
    websocketGame.socket.emit('requestPosition', new Message(me, direction));
}

function requestBombDrop(me) {
    websocketGame.socket.emit('requestBombDrop', new Message(me, ""));
}