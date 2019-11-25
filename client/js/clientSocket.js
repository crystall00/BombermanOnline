const websocketGame = {};
var currentUser;
$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("Connected to server");
    });

    websocketGame.socket.on('broadcast', function (msg) {
        appendMessage(currentUser.id, currentUser.avatar, "right", msg);
    });

    websocketGame.socket.on('passIdentity', function (identity) {
        currentUser = identity;
        console.log('Identity passed. My ID is: ' + currentUser.id);
    });
});