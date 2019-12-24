var explosionSound = document.createElement('audio');
explosionSound.setAttribute('src', '../assets/soundEffects/EXPLOSION Bang Rumbling Long Deep 02.ogg');
var clockSound = document.createElement('audio');
clockSound.setAttribute('src', '../assets/soundEffects/clock.mp3');
var dropSound = document.createElement('audio');
dropSound.setAttribute('src', '../assets/soundEffects/BONG Clunk Hit 02.ogg');
var crySound = document.createElement('audio');
crySound.setAttribute('src', '../assets/soundEffects/VOCAL CUTE Call Angry 01.ogg');
var backgroundMusic = document.createElement('audio');

var catImg = document.createElement("div");
$(catImg).attr("id", "cat");
//$(catImg).attr("src", "../assets/player/cat_000_50x50.png");

var gorillaImg = document.createElement("div");
$(gorillaImg).attr("id", "gorilla");
//$(gorillaImg).attr("src", "../assets/player/gorilla_000_50x50.png");

var penguinImg = document.createElement("div");
$(penguinImg).attr("id", "penguin");
//$(penguinImg).attr("src", "../assets/player/penguin_000_50x50.png");

var rabbitImg = document.createElement("div");
$(rabbitImg).attr("id", "rabbit");
//$(rabbitImg).attr("src", "../assets/player/rabbit_000_50x50.png");

var bombImg = document.createElement("img");
//$(bombImg).attr("src", "../assets/bomb_000_45x45.png");

var timerID;

var interval = {
    // to keep a reference to all the intervals
    intervals: new Set(),

    // create another interval
    make(...args) {
        var newInterval = setInterval(...args);
        this.intervals.add(newInterval);
        return newInterval;
    },

    // clear a single interval
    clear(id) {
        this.intervals.delete(id);
        return clearInterval(id);
    },

    // clear all intervals
    clearAll() {
        for (var id of this.intervals) {
            this.clear(id);
        }
    }
};


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
    if (typeof myself !== "undefined") {
        myFigure = $("#" + myself.figure);
    } else {
        setTimeout(waitForElement, 250);
    }
}

function canMove(me, direction) {
    if (!me.alive) {
        console.log("you are dead :/");
        return false;
    }
    let x = me.position.x;
    let y = me.position.y;
    let toField;
    let toFieldSub;
    switch (direction) {
        case "right":
            toField = $("#" + y + "_" + (x + 1));
            toFieldSub = $("#" + y + "_" + (x + 1) + "_sub");
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toFieldSub).hasClass("bomb"));
        case "down":
            toField = $("#" + (y + 1) + "_" + x);
            toFieldSub = $("#" + (y + 1) + "_" + x + "_sub");
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toFieldSub).hasClass("bomb"));
        case "left":
            toField = $("#" + y + "_" + (x - 1));
            toFieldSub = $("#" + y + "_" + (x - 1) + "_sub");
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toFieldSub).hasClass("bomb"));
        case "up":
            toField = $("#" + (y - 1) + "_" + x);
            toFieldSub = $("#" + (y - 1) + "_" + x + "_sub");
            return !($(toField).hasClass("ice") || $(toField).hasClass("wall") || $(toField).hasClass("block") || $(toField).hasClass("wallVertical") || $(toFieldSub).hasClass("bomb"));
        default:
            break;
    }
}

$(document).ready(function () { // When the DOM is Ready, then bind the click

    interval.make(function () {
        gotHit();
    }, 250);


    $("#playMusic").click(function () {
        if (backgroundMusic.paused === true) {
            $(this).css('background-image', 'url("../assets/icons/sound_on_32x32.png")');
            backgroundMusic.setAttribute('src', '../assets/soundEffects/POL-mutant-jackrabbit-long.wav');
            backgroundMusic.play();
            backgroundMusic.loop = true;
        } else {
            $(this).css('background-image', 'url("../assets/icons/sound_off_32x32.png")');
            backgroundMusic.setAttribute('src', '');
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    });
});

function explode(bombX, bombY) {
    let leftField = $("#" + bombY + "_" + (bombX - 1));
    let rightField = $("#" + bombY + "_" + (bombX + 1));
    let topField = $("#" + (bombY - 1) + "_" + bombX);
    let bottomField = $("#" + (bombY + 1) + "_" + bombX);
    let leftFieldSub = $("#" + bombY + "_" + (bombX - 1) + "_sub");
    let rightFieldSub = $("#" + bombY + "_" + (bombX + 1) + "_sub");
    let topFieldSub = $("#" + (bombY - 1) + "_" + bombX + "_sub");
    let bottomFieldSub = $("#" + (bombY + 1) + "_" + bombX + "_sub");

    if (!($(leftField).hasClass("wall") || $(leftField).hasClass("wallVertical") || $(leftField).hasClass("block"))) {
        $(leftFieldSub).addClass("strideLeft").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(leftField).hasClass("ice")) {
                        $(leftField).animate(
                            {opacity: 0},
                            {
                                duration: 1000,
                                complete: function () {
                                    $(this).removeClass().removeAttr("class").removeAttr("style");
                                }
                            }
                        );
                        fieldUpdate(bombY, bombX - 1);
                    }
                    if ($(leftFieldSub).hasClass("bomb")) {
                        detonate($(leftFieldSub), (bombX - 1), bombY);
                    }
                },
                duration: 1000,
                complete: function () {
                    $(leftFieldSub).removeClass().removeAttr("class").removeAttr("style");
                }
            }
        )
    }
    if (!($(rightField).hasClass("wall") || $(rightField).hasClass("wallVertical") || $(rightField).hasClass("block"))) {
        $(rightFieldSub).addClass("strideRight").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(rightField).hasClass("ice")) {
                        $(rightField).animate(
                            {opacity: 0},
                            {
                                duration: 1000,
                                complete: function () {
                                    $(this).removeClass().removeAttr("class").removeAttr("style");
                                }
                            }
                        );
                        fieldUpdate(bombY, (bombX + 1));
                    }
                    if ($(rightFieldSub).hasClass("bomb")) {
                        detonate($(rightFieldSub), (bombX + 1), bombY);
                    }
                },
                duration: 1000,
                complete: function () {
                    $(rightFieldSub).removeClass().removeAttr("class").removeAttr("style");
                }
            }
        )
    }
    if (!($(topField).hasClass("wall") || $(topField).hasClass("wallVertical") || $(topField).hasClass("block"))) {
        $(topFieldSub).addClass("strideUp").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(topField).hasClass("ice")) {
                        $(topField).animate(
                            {opacity: 0},
                            {
                                duration: 1000,
                                complete: function () {
                                    $(this).removeClass().removeAttr("class").removeAttr("style");
                                }
                            }
                        );
                        fieldUpdate((bombY - 1), bombX);
                    }
                    if ($(this).hasClass("bomb")) {
                        detonate($(this), bombX, (bombY - 1));
                    }
                },
                duration: 1000,
                complete: function () {
                    $(this).removeClass().removeAttr("class").removeAttr("style");
                }
            }
        )
    }
    if (!($(bottomField).hasClass("wall") || $(bottomField).hasClass("wallVertical") || $(bottomField).hasClass("block"))) {
        $(bottomFieldSub).addClass("strideDown").stop().animate(
            {opacity: 0},
            {
                start: function () {
                    if ($(bottomField).hasClass("ice")) {
                        $(bottomField).animate(
                            {opacity: 0},
                            {
                                duration: 1000,
                                complete: function () {
                                    $(this).removeClass().removeAttr("class").removeAttr("style");
                                }
                            }
                        );
                        fieldUpdate((bombY + 1), bombX);
                    }
                    if ($(this).hasClass("bomb")) {
                        detonate($(this), bombX, (bombY + 1));
                    }
                },
                duration: 1000,
                complete: function () {
                    $(this).removeClass().removeAttr("class").removeAttr("style");
                }
            }
        )
    }
}

function gotHit() {
    if (myself.alive) {
        let position = $("#" + myself.position.y + "_" + myself.position.x + "_sub");
        if ($(position).hasClass("strideLeft") || $(position).hasClass("strideRight") || $(position).hasClass("strideUp") || $(position).hasClass("strideDown") || $(position).hasClass("strideTail")) {
            myself.alive = false;
            playerLost();
        }
    }
}


function playerHit(player) {
    $("#" + myself.figure).animate(
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

var counter = 1;

$(document).on('keydown', function (e) {
    if (counter > 0) {
        console.log("Start X: " + myself.position.x + " Start Y :" + myself.position.y);
        if (e.target.nodeName.toLowerCase() !== 'input') {
            switch (e.which) {
                //move left
                case 37:
                    e.preventDefault();
                    if (canMove(myself, "left")) {
                        counter--;
                        requestNewPosition(myself, "left");
                        break;
                    } else {
                        break;
                    }

                //move up
                case 38:
                    e.preventDefault();
                    if (canMove(myself, "up")) {
                        counter--;
                        requestNewPosition(myself, "up");
                        break;
                    } else {
                        break;
                    }

                //move right
                case 39:
                    e.preventDefault();
                    if (canMove(myself, "right")) {
                        counter--;
                        requestNewPosition(myself, "right");
                        break;
                    } else {
                        break;
                    }

                //move down
                case 40:
                    e.preventDefault();
                    if (canMove(myself, "down")) {
                        counter--;
                        requestNewPosition(myself, "down");
                        break;
                    } else {
                        break;
                    }
                default:
                    break;
            }
        }
    } else {
        console.log("counter is 0 :/");
    }
    if (e.target.nodeName.toLowerCase() !== 'input' && e.which === 32) {
        e.preventDefault();
        if (!myself.alive) {
            return false;
        }

        let currentField = $("#" + myself.position.y + "_" + myself.position.x);

        if (!$(currentField).hasClass("bomb")) {
            //dropSound.play();
            requestBombDrop(myself);
            //layBomb(bomb, bombX, bombY);
        }
    }
});

function move(player, direction) {
    let figure = $("#" + player.figure);
    let i = 0;
    let id;
    switch (direction) {
        case "left":
            $(figure).stop().animate({left: "-=50px"}, {
                duration: 360,
                start: function () {
                    $("#" + player.figure).css("transform", "rotateY(180deg)");
                    let i = 0;
                    console.log("Starting animation.... for: " + player.figure);
                    id = setInterval(function () {
                        switch (player.figure) {
                            case "cat":
                                console.log("Cat animation starting now...");
                                if (i < 10) {
                                    $("#" + player.figure).css("background-image", "url(../assets/player/cat/cat_00" + i + "_walk_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "gorilla":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/gorilla/gorilla_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "penguin":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else if (i > 9 && i < 12) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_0" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "rabbit":
                                break;
                            default:
                                break;
                        }

                    }, 40)
                },
                complete: function () {
                    $(this).appendTo($("#" + player.position.y + "_" + player.position.x));
                    $(this).css({left: "0px"});
                    counter++;
                }
            });
            break;
        case "right":
            $(figure).stop().animate({left: "+=50px"}, {
                duration: 360,
                start: function () {
                    $("#" + player.figure).css("transform", "rotateY(0deg)");
                    let i = 0;
                    console.log("Starting animation.... for: " + player.figure);
                    id = setInterval(function () {
                        switch (player.figure) {
                            case "cat":
                                console.log("Cat animation starting now...");
                                if (i < 10) {
                                    $("#" + player.figure).css("background-image", "url(../assets/player/cat/cat_00" + i + "_walk_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "gorilla":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/gorilla/gorilla_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "penguin":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else if (i > 9 && i < 12) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_0" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "rabbit":
                                break;
                            default:
                                break;
                        }

                    }, 40)
                },
                complete: function () {
                    $(this).appendTo($("#" + player.position.y + "_" + player.position.x));
                    $(this).css({left: "0px"});
                    counter++;
                }
            });
            break;
        case "up":
            $(figure).stop().animate({top: "-=50px"}, {
                duration: 360,
                start: function () {
                    let i = 0;
                    console.log("Starting animation.... for: " + player.figure);
                    id = setInterval(function () {
                        switch (player.figure) {
                            case "cat":
                                console.log("Cat animation starting now...");
                                if (i < 10) {
                                    $("#" + player.figure).css("background-image", "url(../assets/player/cat/cat_00" + i + "_walk_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "gorilla":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/gorilla/gorilla_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "penguin":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else if (i > 9 && i < 12) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_0" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "rabbit":
                                break;
                            default:
                                break;
                        }

                    }, 40)
                },
                complete: function () {
                    $(this).appendTo($("#" + player.position.y + "_" + player.position.x));
                    $(this).css({top: "0px"});
                    counter++;
                }
            });
            break;
        case "down":
            $(figure).stop().animate({top: "+=50px"}, {
                duration: 360,
                start: function () {
                    let i = 0;
                    console.log("Starting animation.... for: " + player.figure);
                    id = setInterval(function () {
                        switch (player.figure) {
                            case "cat":
                                console.log("Cat animation starting now...");
                                if (i < 10) {
                                    $("#" + player.figure).css("background-image", "url(../assets/player/cat/cat_00" + i + "_walk_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "gorilla":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/gorilla/gorilla_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "penguin":
                                if (i < 10) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_00" + i + "_dead_50x50.png)");
                                    i++;
                                } else if (i > 9 && i < 12) {
                                    $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_0" + i + "_dead_50x50.png)");
                                    i++;
                                } else {
                                    clearInterval(id);
                                }
                                break;
                            case "rabbit":
                                break;
                            default:
                                break;
                        }

                    }, 40)
                },
                complete: function () {
                    $(this).appendTo($("#" + player.position.y + "_" + player.position.x));
                    $(this).css({top: "0px"});
                    counter++;
                }
            });
            break;
        default:
            break;
    }
}

function layBomb(position) {
    dropSound.play();
    let fieldSub = $("#" + position.y + "_" + position.x + "_sub");
    $(fieldSub).addClass("bomb").stop().animate(
        {display: "none"},
        {
            start: function () {
                clockSound.play();
            },
            duration: 4000,
            complete: function () {
                explosionSound.play();
                $(this).removeClass("bomb").stop().animate(
                    {opacity: 0},
                    {
                        start: function () {
                            $(this).addClass("strideTail");
                            explode(position.x, position.y);
                        },
                        duration: 1000,
                        complete: function () {
                            $(this).removeClass("strideTail").removeAttr("style").removeAttr("style");
                        }
                    }
                )
            }
        }
    )
}

function detonate(bomb, bombX, bombY) {
    explosionSound.play();
    console.log("Removing chain bomb from field: " + $(bomb).id);
    $("#" + bombY + "_" + bombX + "_sub").addClass("strideTail").stop().animate(
        {opacity: 0},
        {
            start: function () {
                explode(bombX, bombY);
            },
            duration: 1000,
            complete: function () {
                $(this).removeClass().removeAttr("class").removeAttr("style");
            }
        }
    )
}


function loadField(field) {
    console.log(JSON.stringify(field));
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[0].length; j++) {
            if (field[i][j] === 1) {
                let searchID = "#" + i + "_" + j;
                console.log("adding ice to: " + searchID);
                $(searchID).addClass('ice');
            }
        }
    }
}

function loseAnimation(figure) {
    let id;
    console.log("Starting die animation for: " + figure);
    $("#" + figure).animate(
        {opacity: 0},
        {
            duration: 5000,
            start: function () {
                let i = 0;
                crySound.play();
                id = setInterval(function () {
                    switch (figure) {
                        case "cat":
                            if (i < 10) {
                                $("#" + figure).css("background-image", "url(../assets/player/cat/cat_00" + i + "_dead_50x50.png)");
                                i++;
                            } else if (i > 9 && i < 12) {
                                $("#" + figure).css("background-image", "url(../assets/player/cat/cat_0" + i + "_dead_50x50.png)");
                                i++;
                            } else {
                                clearInterval(id);
                            }
                            break;
                        case "gorilla":
                            if (i < 10) {
                                $("#" + figure).css("background-image", "url(../assets/player/gorilla/gorilla_00" + i + "_dead_50x50.png)");
                                i++;
                            } else {
                                clearInterval(id);
                            }
                            break;
                        case "penguin":
                            if (i < 10) {
                                $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_00" + i + "_dead_50x50.png)");
                                i++;
                            } else if (i > 9 && i < 12) {
                                $("#" + figure).css("background-image", "url(../assets/player/penguin/penguin_0" + i + "_dead_50x50.png)");
                                i++;
                            } else {
                                clearInterval(id);
                            }
                            break;
                        case "rabbit":
                            break;
                        default:
                            break;
                    }

                }, 25)
            },
            complete: function () {
                $(this).remove();
                clearInterval(id);
            }
        }
    )
}