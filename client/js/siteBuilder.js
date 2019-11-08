$(function () {
    let gameSection = $('game');
    let bootstrapRow = document.createElement('div');
    $(bootstrapRow).addClass('row edge no-gutter ').appendTo($("#game"));
    for (let i = 0; i < 13; i++) {
        let bootstrapRow = document.createElement('div');
        $(bootstrapRow).addClass('row no-gutter').appendTo($("#game"));
        let bootstrapColumn = document.createElement('div');
        $(bootstrapColumn).addClass('col edge').appendTo($(bootstrapRow));
        for (let j = 0; j < 13; j++) {
            let bootstrapColumn = document.createElement('div');
            if (i % 2 !== 0 && j % 2 !== 0) {
                $(bootstrapColumn).addClass('col edge').appendTo($(bootstrapRow));
            } else {
                $(bootstrapColumn).addClass('col').appendTo($(bootstrapRow));
            }
        }
        bootstrapColumn = document.createElement('div');
        $(bootstrapColumn).addClass('col edge').appendTo($(bootstrapRow));
    }
    bootstrapRow = document.createElement('div');
    $(bootstrapRow).addClass('row edge no-gutter ').appendTo($("#game"));
});