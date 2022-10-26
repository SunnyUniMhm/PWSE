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
        gameObject;

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

            if (!$('#main-game-field')) {
                throw "Main game field DOM is not found";
            }
            this.#mainGameField = $('#main-game-field');
            MainGame.gameObject = this;
        }

        static get tilesColors() {
            return {
                2: '#7cb5e2',
                4: '#869da2',
                8: '#d0aa2f',
                16: '#7a321c',
                32: '#9d085b',
                64: '#803d8a',
                128: '#01406f',
                256: '#d161ed',
                512: '#f54c53',
                1024: '#0e7037',
                2048: '#f3dbf9'
            };
        }

        createGameField() {
            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    this.#mainGameField.append(`<div id="cell-${rowNumber}-${cellNumber}" class="rounded text-center fw-bold fs-2"></div>`);
                }
            }
        }

        increaseTotalScore(scoreAmount) {
            if (scoreAmount <= 0) {
                throw "Score amount should be positive integer";
            }
            this.totalScore += scoreAmount;
        }
    }

	class GameTile {
        score;
        color;
        location;

        constructor(locationData) {
            if (
                locationData.rowNumber < 1
                || locationData.rowNumber > 4
                || locationData.cellNumber < 1
                || locationData.cellNumber > 4
            ) {
                throw "Invalid tile coordinates: Outside of the game field";
            }

            this.score = 2;
            this.color = MainGame.tilesColors[this.score];
            this.location = [
                locationData.rowNumber,
                locationData.cellNumber
            ];
        }

        upgradeTile() {
            if (
                this.score >= 2048
                || (this.score * 2) > 2048
            ) {
                throw "Impossible to upgrade tile over 2048 score";
            }

            this.score = this.score * 2;
            if (!MainGame.tilesColors[this.score]) {
                throw "Missing color for upgraded tile";
            }
            this.color = MainGame.tilesColors[this.score];
            MainGame.gameObject.increaseTotalScore(this.score);
        }
    }

    try {
        var game = new MainGame();
    } catch (exception) {
        alert(exception);
    }

    game.createGameField();
});
