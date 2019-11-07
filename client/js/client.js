const client = {};

$(function () {
    client.socket = io();

    client.socket.on('announcement', (msg) => {
        console.log(msg);
    });
    client.socket.on('disconnect', function () {
        client.socket.broadcast.emit('announcement', 'Im out!');
    });
});
