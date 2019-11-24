const websocketGame = {};
$(function () {
    websocketGame.socket = io();

    websocketGame.socket.on('connect', () => {
        console.log("Client connected!");
    });

    websocketGame.socket.on('broadcast', function (msg) {
        alert(msg);
    });

  /*  $("#sendButton").click(function () {
        console.log("Button pressed!");
        websocketGame.socket.emit('message', 'hello friends!');
    })*/
});