var explosionSound = document.createElement('audio');
explosionSound.setAttribute('src', '../assets/soundEffects/EXPLOSION Bang Rumbling Long Deep 02.ogg');
var clockSound = document.createElement('audio');
clockSound.setAttribute('src', '../assets/soundEffects/clock.mp3');
var dropSound = document.createElement('audio');
dropSound.setAttribute('src', '../assets/soundEffects/BONG Clunk Hit 02.ogg');
var crySound = document.createElement('audio');
crySound.setAttribute('src', '../assets/soundEffects/VOCAL CUTE Call Angry 01.ogg');

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
    if (!currentUser.alive) {
        console.log("you are dead :/");
        return false;
    }
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

function explode(bombX, bombY) {
    let leftField = $("#" + bombY + "_" + (bombX - 1));
    let rightField = $("#" + bombY + "_" + (bombX + 1));
    let topField = $("#" + (bombY - 1) + "_" + bombX);
    let bottomField = $("#" + (bombY + 1) + "_" + bombX);

    if (!($(leftField).hasClass("wall") || $(leftField).hasClass("wallVertical") || $(leftField).hasClass("block"))) {
        $(leftField).addClass("strideLeft").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(leftField).hasClass("bomb")) {
                        $(leftField).stop();
                        detonate(leftField, (bombX - 1), bombY);
                    }
                    gotHit();
                },
                progress: function () {
                    gotHit();
                },
                duration: 1000,
                complete: function () {
                    if (!currentUser.alive) {
                        $("#" + currentUser.figure).remove();
                    }
                    $(this).removeClass().removeAttr("style");
                }
            }
        )
    }
    if (!($(rightField).hasClass("wall") || $(rightField).hasClass("wallVertical") || $(rightField).hasClass("block"))) {
        $(rightField).addClass("strideRight").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(rightField).hasClass("bomb")) {
                        $(rightField).stop();
                        detonate(rightField, (bombX + 1), bombY);
                    }
                    gotHit();
                },
                progress: function () {
                    gotHit()
                },
                duration: 1000,
                complete: function () {
                    if (!currentUser.alive) {
                        $("#" + currentUser.figure).remove();
                    }
                    $(this).removeClass().removeAttr("style");
                }
            }
        )
    }
    if (!($(topField).hasClass("wall") || $(topField).hasClass("wallVertical") || $(topField).hasClass("block"))) {
        $(topField).addClass("strideUp").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(topField).hasClass("bomb")) {
                        $(topField).stop();
                        detonate(topField, bombX, (bombY - 1));
                    }
                    gotHit();
                },
                progress: function () {
                    gotHit()
                },
                duration: 1000,
                complete: function () {
                    if (!currentUser.alive) {
                        $("#" + currentUser.figure).remove();
                    }
                    $(this).removeClass().removeAttr("style");
                }
            }
        )
    }
    if (!($(bottomField).hasClass("wall") || $(bottomField).hasClass("wallVertical") || $(bottomField).hasClass("block") || $(bottomField).hasClass("bomb"))) {
        $(bottomField).addClass("strideDown").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(bottomField).hasClass("bomb")) {
                        $(bottomField).stop();
                        detonate(bottomField, bombX, (bombY + 1));
                    }
                    gotHit();
                },
                progress: function () {
                    gotHit()
                },
                duration: 1000,
                complete: function () {
                    if (!currentUser.alive) {
                        $("#" + currentUser.figure).remove();
                    }
                    $(this).removeClass().removeAttr("style");
                }
            }
        )
    }
}

function gotHit() {
    if (currentUser.alive) {
        let position = $("#" + currentUser.position.y + "_" + currentUser.position.x);
        if ($(position).hasClass("strideLeft") || $(position).hasClass("strideRight") || $(position).hasClass("strideUp") || $(position).hasClass("strideDown") || $(position).hasClass("strideTail")) {
            crySound.play();
            currentUser.alive = false;
            $("#" + currentUser.figure).animate(
                {display: "none"},
                {
                    start: function () {
                        switch ($(this).attr('id')) {
                            case "cat":
                                $(this).attr("src", "../assets/player/cat_000_dead_50x50.png");
                                break;
                            case "gorilla":
                                $(this).attr("src", "../assets/player/gorilla_000_dead_50x50.png");
                                break;
                            case "penguin":
                                $(this).attr("src", "../assets/player/penguin_000_dead_50x50.png");
                                break;
                            case "rabbit":
                                $(this).attr("src", "../assets/player/rabbit_000_dead_50x50.png");
                                break;
                            default:
                                break;
                        }
                    },
                    duration: 1000
                }
            );
        }
    }
}

$(document).on('keydown', function (e) {
    switch (e.which) {
        //         //move left
        case 37:
            if (canMove(currentUser.position, "left")) {
                $(myFigure).animate({left: "-=50px"}, {
                    start: function () {
                        currentUser.position.x--;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({left: "0px"});
                        $(this).clearQueue();
                    }
                });
                break;
            } else {
                break;
            }

        //move up
        case 38:
            if (canMove(currentUser.position, "up")) {
                $(myFigure).animate({top: "-=50px"}, {
                    start: function () {
                        currentUser.position.y--;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({top: "0px"});
                        $(this).clearQueue();
                    }
                });
                break;
            } else {
                break;
            }

        //move right
        case 39:
            if (canMove(currentUser.position, "right")) {
                $(myFigure).animate({left: "+=50px"}, {
                    start: function () {
                        currentUser.position.x++;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({left: "0px"});
                        $(this).clearQueue();
                    }
                });
                break;
            } else {
                break;
            }

        //move down
        case 40:
            if (canMove(currentUser.position, "down")) {
                $(myFigure).animate({top: "+=50px"}, {
                    start: function () {
                        currentUser.position.y++;
                    },
                    duration: "fast",
                    complete: function () {
                        $(this).appendTo($("#" + currentUser.position.y + "_" + currentUser.position.x));
                        $(this).css({top: "0px"});
                        $(this).clearQueue();
                    }
                });
                break;
            } else {
                break;
            }
        case 32:
            if (!currentUser.alive) {
                return false;
            }
            let bombX = currentUser.position.x;
            let bombY = currentUser.position.y;
            let bomb = $("#" + bombY + "_" + bombX);

            if (!$(bomb).hasClass("bomb")) {
                dropSound.play();
                layBomb(bomb, bombX, bombY);
            }
            break;
    }
});

function layBomb(bomb, bombX, bombY) {
    $(bomb).addClass("bomb").stop().animate(
        {display: "none"},
        {
            start: function () {
                clockSound.play();
            },
            duration: 4000,
            complete: function () {
                explosionSound.play();
                $(this).removeClass("bomb").addClass("strideTail").animate(
                    {opacity: 0},
                    {
                        start: function () {
                            explode(bombX, bombY);
                        },
                        duration: 1000,
                        complete: function () {
                            $(this).removeClass("strideTail").removeAttr("style");
                        }
                    }
                )
            }
        }
    )
}

function detonate(bomb, bombX, bombY) {
    explosionSound.play();
    $(bomb).removeClass("bomb").addClass("strideTail").animate(
        {opacity: 0},
        {
            start: function () {
                explode(bombX, bombY);
            },
            duration: 1000,
            complete: function () {
                $(this).removeClass().removeAttr("style");
            }
        }
    )
}






