$(document).ready(function () {
    /* eslint-env jquery */
    "use strict";
    
    function createGameField() {
        const mainGameField = $('#main-game-field');
        
        for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
            for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                mainGameField.append(`<div id="cell-${rowNumber}-${cellNumber}" class="rounded text-center fw-bold fs-2"></div>`);
            }
        }
    }
    
    createGameField();
});