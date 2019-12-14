var catImg = document.createElement("img");
$(catImg).attr("id", "cat");
$(catImg).attr("src", "../assets/player/cat_000_50x50.png");

var gorillaImg = document.createElement("img");
$(gorillaImg).attr("id", "gorilla");
$(gorillaImg).attr("src", "../assets/player/gorilla_000_50x50.png");

var penguinImg = document.createElement("img");
$(penguinImg).attr("id", "penguin");
$(penguinImg).attr("src", "../assets/player/penguin_000_50x50.png");

var rabbitImg = document.createElement("img");
$(rabbitImg).attr("id", "rabbit");
$(rabbitImg).attr("src", "../assets/player/rabbit_000_50x50.png");


function resetPlayers() {
    let startPositionA = $("#1_1");
    let startPositionB = $("#1_13");
    let startPositionC = $("#13_1");
    let startPositionD = $("#13_13");
    $(catImg).remove();
    $(gorillaImg).remove();
    $(penguinImg).remove();
    $(rabbitImg).remove();
    $(catImg).appendTo($(startPositionA));
    $(gorillaImg).appendTo($(startPositionB));
    $(penguinImg).appendTo($(startPositionC));
    $(rabbitImg).appendTo($(startPositionD));
}

var myFigure;

$(waitForElement());

function waitForElement() {
    if (typeof currentUser !== "undefined") {
        myFigure = $("#" + currentUser.figure);
        console.log("I am: " + JSON.stringify(currentUser));
    } else {
        setTimeout(waitForElement, 250);
    }
}

function canMove(position, direction) {
    var x = position.x;
    var y = position.y;
    var toField;
    switch (direction) {
        case "right":
            x++;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical"));
        case "down":
            y++;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical"));
        case "left":
            x--;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical"));
        case "up":
            y--;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical"));
        default:
            break;
    }
}

$(document).on('keydown', function (e) {
    switch (e.which) {
        //move left
        case 37:
            if (canMove(currentUser.position, "left")) {
                $(myFigure).css('transition', '500ms');
                $(myFigure).css('transform', 'translate(-50px, 0px)');
                /*$(myFigure).stop().animate({left: "-=50px"}, {
                    start: function () {
                        currentUser.position.x--;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({left: "0px"});
                    }
                });*/
                break;
            } else {
                break;
            }

        //move up
        case 38:
            if (canMove(currentUser.position, "up")) {
                $(myFigure).stop().animate({top: "-=50px"}, {
                    start: function () {
                        currentUser.position.y--;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({top: "0px"});
                    }
                });
                break;
            } else {
                break;
            }

        //move right
        case 39:
            if (canMove(currentUser.position, "right")) {
                $(myFigure).stop().animate({left: "+=50px"}, {
                    start: function () {
                        currentUser.position.x++;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({left: "0px"});
                    }
                });
                break;
            } else {
                break;
            }

        //move down
        case 40:
            if (canMove(currentUser.position, "down")) {
                $(myFigure).stop().animate({top: "+=50px"}, {
                    start: function () {
                        currentUser.position.y++;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({top: "0px"});
                    }
                });
                break;
            } else {
                break;
            }
    }
});







