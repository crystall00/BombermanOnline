var playerA;
var PlayerB;
var playerC;
var playerD;

function player(name, position) {
    this.name = name;
    this.position = position;
}

function resetPlayers() {
    let startPositionA = $("#1_1");
    let startPositionB = $("#1_13");
    let startPositionC = $("#13_1");
    let startPositionD = $("#13_13");
    $(startPositionA).addClass("catPlayer");
    $(startPositionB).addClass("gorillaPlayer");
    $(startPositionC).addClass("penguinPlayer");
    $(startPositionD).addClass("rabbitPlayer");
}

function moveDown(){

}

function moveUp(){

}

function moveLeft(){

}

function moveRight(){

}