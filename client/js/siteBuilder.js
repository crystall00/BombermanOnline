$(resetGame);

function resetGame() {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            let divElement = document.createElement('div');
            divElement.id = i.toString() + "_" + j.toString();
            let divElementSub = document.createElement('div');
            console.log("######################### PARENT: " + divElement.id);
            divElementSub.id = divElement.id + "_sub";
            console.log("######################### CHILD: " + divElementSub.id);
            $(divElementSub).appendTo(divElement);
            if (i === 0 || i === 14) {
                $(divElement).addClass('wall').appendTo($("#game"));
            } else if ((j === 0 || j === 14) && (i !== 0 || i !== 14)) {
                $(divElement).addClass('wallVertical').appendTo($("#game"));
            } else if ((i % 2 === 0 && j % 2 === 0)) {
                $(divElement).addClass('block').appendTo($("#game"));
            } else {
                $(divElement).appendTo($("#game"));
            }
        }
    }
    resetPlayers();
}