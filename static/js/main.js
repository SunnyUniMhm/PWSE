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
        #gameScoreElement;
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
                throw "Main game field element is not found";
            }
            this.#mainGameField = $('#main-game-field');
            if (!$('#game-score')) {
                throw "Game score element is not found";
            }
            this.#gameScoreElement = $('#game-score');
            this.maxTileScore = 2;
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

        increaseMaxTileScore() {
            if (
                this.maxTileScore >= 2048
                || (this.maxTileScore * 2) > 2048
            ) {
                throw "Impossible to set max. tile score over 2048";
            }
            this.maxTileScore = this.maxTileScore * 2;
        }

        updateAmountOfTheFreeCells () {
            let currentAmountOfFreeCells = 0;
            for (let row in this.tilesData) {
                for (let cell in this.tilesData[row]) {
                    if (!this.tilesData[row][cell]) {
                        currentAmountOfFreeCells += 1;
                    }
                }
            }

            this.freeCellsLeft = currentAmountOfFreeCells;
        }

        renderCurrentGameScore () {
            this.#gameScoreElement.text(this.totalScore);
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

            if (MainGame.gameObject.tilesData[locationData.rowNumber][locationData.cellNumber] !== null) {
                throw `Trying to create already existing tile on [${locationData.rowNumber}][${locationData.cellNumber}]`;
            }

            this.score = 2;
            this.color = MainGame.tilesColors[this.score];
            this.location = {
                rowNumber: locationData.rowNumber,
                cellNumber: locationData.cellNumber
            };
            MainGame.gameObject.tilesData[locationData.rowNumber][locationData.cellNumber] = this;
            MainGame.gameObject.updateAmountOfTheFreeCells();
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
            MainGame.gameObject.renderCurrentGameScore();

            if (this.score > MainGame.gameObject.maxTileScore) {
                try {
                    MainGame.gameObject.increaseMaxTileScore();
                } catch (exception) {
                    alert(exception);
                }
            }
        }

        destroyTile () {
            if (MainGame.gameObject.tilesData[this.location.rowNumber][this.location.cellNumber] === null) {
                throw `Trying to delete already non-existent tile on [${this.location.rowNumber}][${this.location.cellNumber}]`;
            }

            MainGame.gameObject.tilesData[this.location.rowNumber][this.location.cellNumber] = null;
            MainGame.gameObject.updateAmountOfTheFreeCells();
        }
    }

    try {
        var game = new MainGame();
    } catch (exception) {
        alert(exception);
    }

    game.createGameField();
});
