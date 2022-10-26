/* jslint browser: true */
/* jslint es6: true */
/* global $, jQuery, document */
/* eslint-env jquery */
/* eslint-env es6 */

$(document).ready(function () {
    "use strict";
    
    class MainGame {
        totalScore;
        maxTileScore;
        freeCellsLeft;
        tilesData;
        #mainGameField;
        
        constructor() {
            this.totalScore = 0;
            this.maxTileScore = 0;
            this.freeCellsLeft = 16;
            this.tilesData = {
                1: {
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                },
                2: {
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                },
                3: {
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                },
                4: {
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                }
            };
            this.#mainGameField = $('#main-game-field');
        }

        createGameField() {
            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    this.#mainGameField.append(`<div id="cell-${rowNumber}-${cellNumber}" class="rounded text-center fw-bold fs-2"></div>`);
                }
            }
        }
    }

    var game = new MainGame();
    console.log(game);
    game.createGameField();
});
