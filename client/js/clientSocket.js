const websocketGame = {};
var currentUser;

$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("Connected to server");
    });

    websocketGame.socket.on('passIdentity', function (identity) {
        currentUser = identity;
        console.log('Identity passed. My ID is: ' + currentUser.id);
        console.log('My Figure is: ' + currentUser.figure);
        console.log('My position is: ' + JSON.stringify(currentUser.position));
    });

    websocketGame.socket.on('broadcast', function (msg) {
        if (msg.from.id === currentUser.id) {
            appendMessage('Player ' + currentUser.id, currentUser.imgPath, "right", msg.message);
        } else {
            appendMessage('Player ' + msg.from.id, msg.from.imgPath, "left", msg.message);
        }
    });

    websocketGame.socket.on('botMessage', function (msg) {
        botResponse(msg);
    });
});