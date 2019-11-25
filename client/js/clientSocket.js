const websocketGame = {};
var currentUser;
$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("Connected to server");
    });

    websocketGame.socket.on('broadcast', function (msg) {
        if (msg.from.id === currentUser.id) {
            appendMessage('Player ' + currentUser.id, currentUser.avatar, "right", msg.message);
        } else {
            appendMessage('Player ' + msg.from.id, msg.from.avatar, "left", msg.message);
        }
    });

    websocketGame.socket.on('passIdentity', function (identity) {
        currentUser = identity;
        console.log('Identity passed. My ID is: ' + currentUser.id);
    });
});