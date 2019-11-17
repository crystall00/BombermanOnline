$(resetGame);

function resetGame() {
    let gameContainer = $('#game');
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            let divElement = document.createElement('div');
            divElement.id = i.toString() + "_" + j.toString();
            if (i === 0 || j === 0 || i === 14 || j === 14) {
                $(divElement).addClass('wall').appendTo($("#game"));
            } else if ((i % 2 === 0 && j % 2 === 0)) {
                $(divElement).addClass('wall').appendTo($("#game"));
            } else if (!((i < 3 || i > 11) && (j < 3 || j > 11))) {
                $(divElement).addClass('ice').appendTo($("#game"));
            } else {
                $(divElement).appendTo($("#game"));
            }
        }
    }
    resetPlayers();
}