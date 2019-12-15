var audioElement = document.createElement('audio');
audioElement.setAttribute('src', '../assets/soundEffects/EXPLOSION Bang Rumbling Long Deep 02.ogg');

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

var bombImg = document.createElement("img");
$(bombImg).attr("src", "../assets/bomb_000_45x45.png");


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
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toField).hasClass("bomb"));
        case "down":
            y++;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toField).hasClass("bomb"));
        case "left":
            x--;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toField).hasClass("bomb"));
        case "up":
            y--;
            toField = $("#" + y + "_" + x);
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toField).hasClass("bomb"));
        default:
            break;
    }
}

$(document).ready(function () { // When the DOM is Ready, then bind the click
    $("#playMusic").click(function () {
        var backgroundMusic = document.createElement('audio');
        backgroundMusic.setAttribute('src', '../assets/soundEffects/POL-mutant-jackrabbit-long.wav');
        backgroundMusic.currentTime = 0;
        backgroundMusic.loop = true;
        if (backgroundMusic.paused === true) {
            console.log("Was paused, playing music now!");
            backgroundMusic.play();
        } else {
            console.log("Was playing music, pausing now!");
            backgroundMusic.pause();
        }

    });
});

function destroy(bombX, bombY) {
    var left = $("#" + bombY + "_" + (bombX - 1));
    var right = $("#" + bombY + "_" + (bombX + 1));
    var up = $("#" + (bombY - 1) + "_" + bombX);
    var down = $("#" + (bombY + 1) + "_" + bombX);
    if (left.hasClass("ice")) {
        left.animate({opacity: 0}, {
            duration: 500,
            complete: function () {
                $(this).removeClass("ice");
                $(this).removeAttr("style");
            }
        })
    }
    if (right.hasClass("ice")) {
        right.animate({opacity: 0}, {
            duration: 500,
            complete: function () {
                $(this).removeClass("ice");
                $(this).removeAttr("style");
            }
        })
    }
    if (up.hasClass("ice")) {
        up.animate({opacity: 0}, {
            duration: 500,
            complete: function () {
                $(this).removeClass("ice");
                $(this).removeAttr("style");
            }
        })
    }
    if (down.hasClass("ice")) {
        down.animate({opacity: 0}, {
            duration: 500,
            complete: function () {
                $(this).removeClass("ice");
                $(this).removeAttr("style");
            }
        })
    }
}

$(document).on('keydown', function (e) {
    switch (e.which) {
        //move left
        case 37:
            if (canMove(currentUser.position, "left")) {
                $(myFigure).stop().animate({left: "-=50px"}, {
                    start: function () {
                        currentUser.position.x--;
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
        case 32:
            var bombX = currentUser.position.x;
            var bombY = currentUser.position.y;
            var bomb = $("#" + bombY + "_" + bombX);
            var leftField;
            var rightField;
            var topField;
            var bottomField;
            $(bomb).stop().animate(
                {opacity: 1}, {
                    duration: 3000,
                    start: function () {
                        $(bomb).addClass("bomb");
                        $(bomb).animate({opacity: 0}, {
                            start: function () {
                                destroy(bombX, bombY);
                                var leftId = "#" + bombY + "_" + (bombX - 1);
                                leftField = $(leftId);
                                var rightId = "#" + bombY + "_" + (bombX + 1);
                                rightField = $(rightId);
                                var topId = "#" + (bombY - 1) + "_" + bombX;
                                topField = $(topId);
                                var bottomId = "#" + (bombY + 1) + "_" + bombX;
                                bottomField = $(bottomId);
                                $(bomb).addClass("strideTail");
                                $(leftField).addClass("strideLeft");
                                $(rightField).addClass("strideRight");
                                $(topField).addClass("strideUp");
                                $(bottomField).addClass("strideDown");
                                $(bomb).removeClass("bomb");
                            },
                            duration: 2000,
                            step: function () {
                                audioElement.play();
                            },
                            complete: function () {
                                $(bomb).removeClass("strideTail");
                                $(leftField).removeClass("strideLeft");
                                $(rightField).removeClass("strideRight");
                                $(topField).removeClass("strideUp");
                                $(bottomField).removeClass("strideDown");
                                $(bomb).removeAttr("style");
                                $(leftField).removeAttr("style");
                                $(rightField).removeAttr("style");
                                $(topField).removeAttr("style");
                                $(bottomField).removeAttr("style");
                            }
                        })
                    }
                }
            );
            break;
    }
});







