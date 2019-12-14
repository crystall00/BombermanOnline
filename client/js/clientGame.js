var playerA;
var PlayerB;
var playerC;
var playerD;

var catImg = document.createElement("img");
$(catImg).attr("id", "cat");
$(catImg).attr("src", "../assets/player/cat_000_50x50.png");

function player(name, position, figure) {
    this.name = name;
    this.position = position;
    this.figure = figure;
}

function resetPlayers() {
    let startPositionA = $("#1_1");
    let startPositionB = $("#1_13");
    let startPositionC = $("#13_1");
    let startPositionD = $("#13_13");
    $(catImg).appendTo($(startPositionA));
    $(startPositionB).addClass("gorillaPlayer");
    $(startPositionC).addClass("penguinPlayer");
    $(startPositionD).addClass("rabbitPlayer");
}

$(document).keydown(function (e) {
    $(catImg).keydown;
    switch (e.which) {

        //move left
        case 37:
            $(catImg).animate({left: "-=50px"}, 'fast');
            break;

        //move up
        case 38:
            $(catImg).animate({top: "-=50px"}, 'fast');
            break;

        //move right
        case 39:
            $(catImg).animate({left: "+=50px"}, 'fast');
            break;

        //move down
        case 40:
            $(catImg).animate({top: "+=50px"}, 'fast');
            break;
    }
});

