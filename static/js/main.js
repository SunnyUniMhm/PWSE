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
        #defaultCellBgColor;

        constructor() {
            this.#defaultCellBgColor = '#e5dede';
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
            this.createGameField();
            this.renderCurrentGameScore();
            this.createRandomTile();
            this.renderGameTiles();
            this.enableHotkeys();
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

        enableHotkeys () {
            // removing all hotkeys events to be sure
            // that events will not be duplicated
            $(document).off('keydown');
            $(document).on('keydown', function (e) {
                var keyPressed = e.originalEvent.code;
                if (keyPressed === "ArrowUp") {
                    MainGame.gameObject.playTileArrowMovementAnimation('up');
                    MainGame.gameObject.combineAllPossibleTiles("up");
                    MainGame.gameObject.moveAllTiles("up");
                } else if (keyPressed === "ArrowDown") {
                    MainGame.gameObject.playTileArrowMovementAnimation('down');
                    MainGame.gameObject.combineAllPossibleTiles("down");
                    MainGame.gameObject.moveAllTiles("down");
                } else if (keyPressed === "ArrowLeft") {
                    MainGame.gameObject.playTileArrowMovementAnimation('left');
                    MainGame.gameObject.combineAllPossibleTiles("left");
                    MainGame.gameObject.moveAllTiles("left");
                } else if (keyPressed === "ArrowRight") {
                    MainGame.gameObject.playTileArrowMovementAnimation('right');
                    MainGame.gameObject.combineAllPossibleTiles("right");
                    MainGame.gameObject.moveAllTiles("right");

                } else if (keyPressed === "KeyR") {
                    MainGame.gameObject.restartGame();
                }

                if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(keyPressed)) {
                    MainGame.gameObject.createRandomTile();
                    MainGame.gameObject.renderCurrentGameScore();
                    if (MainGame.gameObject.checkIfPlayerWonTheGame()) {
                        MainGame.gameObject.disableArrowKeys();
                        MainGame.gameObject.renderPlayerHasWonScreen();
                        return;
                    }
                    if (MainGame.gameObject.checkIfPlayerLostTheGame()) {
                        MainGame.gameObject.disableArrowKeys();
                        MainGame.gameObject.renderPlayerHasLostScreen();
                        return;
                    }
                }
            });
        }

        disableArrowKeys() {
            // removing arrow keys controls and only allowing
            // restart key functionality
            $(document).off('keydown');
            $(document).on('keydown', function (e) {
                var keyPressed = e.originalEvent.code;
                if (keyPressed === "KeyR") {
                    MainGame.gameObject.restartGame();
                }
            });
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

        renderGameTiles () {
            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    let currentTile = this.tilesData[rowNumber][cellNumber];
                    if (currentTile === null) {
                        this.#mainGameField.children(`#cell-${rowNumber}-${cellNumber}`).text('');
                        this.#mainGameField.children(`#cell-${rowNumber}-${cellNumber}`).css('background-color', this.#defaultCellBgColor);
                        continue;
                    }

                    this.#mainGameField.children(`#cell-${rowNumber}-${cellNumber}`).text(currentTile.score);
                    this.#mainGameField.children(`#cell-${rowNumber}-${cellNumber}`).css('background-color', currentTile.color);

                }
            }
        }

        checkIfPlayerWonTheGame () {
            if (this.maxTileScore !== 2048) {
                return false
            } else {
                return true;
            }
        }

        checkIfPlayerLostTheGame () {
            if (this.freeCellsLeft !== 0) {
                return false;
            }
            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    let currentCell = this.tilesData[rowNumber][cellNumber];
                    // check if the current cell is empty
                    if (currentCell === null) {
                        continue;
                    }
                    // check if any nearby tile is combinable with current one
                    // and if any is combinable return FALSE
                    // since player has not yet lost the game
                    if (
                        currentCell.checkForPossibilityOfTheCombining("up") === true
                        || currentCell.checkForPossibilityOfTheCombining("down") === true
                        || currentCell.checkForPossibilityOfTheCombining("left") === true
                        || currentCell.checkForPossibilityOfTheCombining("right") === true
                    ) {
                        return false;
                    }
                }
            }
            return true;
        }

        renderPlayerHasWonScreen () {
            $('#main-game-field').before('<div id="player-has-won-screen" class="game-result-screen w-100 h-100 bg-secondary fw-bold text-white text-center rounded fs-2 text-uppercase position-absolute p-0 m-0">You have won!!</div>');
        }

        removePlayerHasWonScreen () {
            if ($('#player-has-won-screen') !== null) {
                $('#player-has-won-screen').remove();
            }
        }

        renderPlayerHasLostScreen () {
            $('#main-game-field').before('<div id="player-has-lost-screen" class="game-result-screen w-100 h-100 bg-secondary fw-bold text-white text-center rounded fs-2 text-uppercase position-absolute p-0 m-0">You have lost</div>');
        }

        removePlayerHasLostScreen () {
            if ($('#player-has-lost-screen') !== null) {
                $('#player-has-lost-screen').remove();
            }
        }

        playTileArrowMovementAnimation(direction) {
            console.log(direction);
            var animationClasses = {
                "up":'tile-movement-arrow-top',
                "down":'tile-movement-arrow-bottom',
                "left":'tile-movement-arrow-left',
                "right":'tile-movement-arrow-right'
            };
            if (!['up', 'down', 'left', 'right'].includes(direction)) {
                throw "Trying to create arrow moving in unknown direction";
            }

            // adding arrow image on screen
            $('#main-game-field').before('<div id="tile-movement-arrow-container" class="w-100 h-100 opacity-25 fw-bold text-white text-center rounded fs-2 position-absolute p-0 m-0"><img src="static/img/squared_arrow_256px.png"></div>');
            console.log('arrow was created');
            // removing prevous animations if any
            $('#tile-movement-arrow-container').removeClass("tile-movement-arrow-top tile-movement-arrow-bottom tile-movement-arrow-left tile-movement-arrow-right");
            // playing arrow animation accordingly to direction
            $('#tile-movement-arrow-container').addClass(animationClasses[direction]);
            // removing arrow image from the screen after 0.225 seconds
            // so animation will have enough time to be finished
            setTimeout(function () {
                $('#tile-movement-arrow-container').remove();
            }, 225);
        }

        restartGame() {
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

            this.maxTileScore = 2;
            this.totalScore = 0;
            this.updateAmountOfTheFreeCells();
            this.removePlayerHasWonScreen();
            this.removePlayerHasLostScreen();
            this.renderCurrentGameScore();
            this.renderGameTiles();
            this.renderCurrentGameScore();
            this.createRandomTile();
            this.enableHotkeys();
        }

        getRandomEmptyCellLocation () {
            var currentlyEmptyCells = [];
            var randomEmptyCell = [];

            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    let currentCell = this.tilesData[rowNumber][cellNumber];
                    if (currentCell === null) {
                        currentlyEmptyCells.push([rowNumber, cellNumber]);
                    }
                }
            }

            if (currentlyEmptyCells.length > 0) {
                randomEmptyCell = currentlyEmptyCells[Math.floor(Math.random() * currentlyEmptyCells.length)];
                return {
                    rowNumber: randomEmptyCell[0],
                    cellNumber: randomEmptyCell[1]
                };
            } else {
                return false;
            }
        }

        createRandomTile() {
            if (this.freeCellsLeft > 0) {
                const tileLocation = this.getRandomEmptyCellLocation();
                new GameTile(tileLocation);
            }
        }

        combineAllPossibleTiles(combiningDirection) {
            let tilesToBeCombined = [];

            for (let rowNumber = 1; rowNumber <= 4; rowNumber ++) {
                for (let cellNumber = 1; cellNumber <= 4; cellNumber ++) {
                    let currentTile = this.tilesData[rowNumber][cellNumber];
                    if (currentTile === null) {
                        continue;
                    }

                    let combiningIsPossible = currentTile.checkForPossibilityOfTheCombining(combiningDirection);
                    if (combiningIsPossible === true) {
                        tilesToBeCombined.push(currentTile);
                    }
                }
            }

            if (tilesToBeCombined.length > 0) {
                for (let currentlyCombinedTile of tilesToBeCombined) {
                    currentlyCombinedTile.combineTiles(combiningDirection);
                }
            }
        }

        moveAllTiles(direction) {
            // starting/last row/cell numbers for cycling through all game tiles
            var startingRow = 0;
            var startingCell = 0;
            var lastRow = 0;
            var lastCell = 0;
            // direction of cycling through rows/cells
            var rowsCycleDirection = "forward";
            var cellsCycleDirection = "forward";

            if (!['up', 'down', 'left', 'right'].includes(direction)) {
                throw "Trying to move game tiles in unknown direction";
            }

            if (direction === "up") {
                startingRow = 1;
                startingCell = 1;
                lastRow = 4;
                lastCell = 4;
                rowsCycleDirection = "forward";
                cellsCycleDirection = "forward";
            } else if (direction === "down") {
                startingRow = 4;
                startingCell = 1;
                lastRow = 1;
                lastCell = 4;
                rowsCycleDirection = "backward";
                cellsCycleDirection = "forward";
            } else if (direction === "left") {
                startingRow = 1;
                startingCell = 1;
                lastRow = 4;
                lastCell = 4;
                rowsCycleDirection = "forward";
                cellsCycleDirection = "forward";
            } else if (direction === "right") {
                startingRow = 1;
                startingCell = 4;
                lastRow = 4;
                lastCell = 1;
                rowsCycleDirection = "forward";
                cellsCycleDirection = "backward";
            }
            // cycling through all game tiles using specified parameters
            for (let row = startingRow;;) {
                for (let cell = startingCell;;) {
                    if (MainGame.gameObject.tilesData[row][cell] !== null) {
                        MainGame.gameObject.tilesData[row][cell].moveTile(direction);
                    }
                    if (cellsCycleDirection === "forward") {
                        if (cell < lastCell) {
                            cell ++;
                        } else {
                            break;
                        }
                    } else if (cellsCycleDirection === "backward") {
                        if (cell > lastCell) {
                            cell --;
                        } else {
                            break;
                        }
                    }
                }

                if (rowsCycleDirection === "forward") {
                    if (row < lastRow) {
                        row ++;
                    } else {
                        break;
                    }
                } else if (rowsCycleDirection === "backward") {
                    if (row > lastRow) {
                        row --;
                    } else {
                        break;
                    }
                }
            }
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
            MainGame.gameObject.renderGameTiles();
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
            MainGame.gameObject.renderGameTiles();

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
            MainGame.gameObject.renderGameTiles();
        }

        moveTile(direction) {
            var newTileLocation = this.generateNewTileLocation(direction);
            this.changeTileLocation(newTileLocation);
        }

        generateNewTileLocation(direction) {
            // current tile location
            var currentLocationData = {
                rowNumber: this.location.rowNumber,
                cellNumber: this.location.cellNumber
            };
            // location of the tile next to current in the specified direction
            var nextTileLocation = {
                rowNumber: 0,
                cellNumber: 0
            };
            // new tile location after modifying according to the direction
            var newTileLocation = {
                rowNumber: 0,
                cellNumber: 0
            };
            if (!['up', 'down', 'left', 'right'].includes(direction)) {
                throw "Trying to move game tile in unknown direction";
            }
            nextTileLocation = this.lookForTheNextTile(direction);
            // if tile can't move in the specified location (located on the edge of the field)
            // simply return tile's current location
            if (nextTileLocation === false) {
                return currentLocationData;
            }
            // if not tiles found in the specified direction
            // generate location on the edge of the field in this direction
            if (nextTileLocation === null) {
                newTileLocation = currentLocationData;

                if (direction === "up") {
                    newTileLocation.rowNumber = 1;
                } else if (direction === "down") {
                    newTileLocation.rowNumber = 4;
                } else if (direction === "left") {
                    newTileLocation.cellNumber = 1;
                } else if (direction === "right") {
                    newTileLocation.cellNumber = 4;
                }
            // if tile was found, generate location
            // right next to found tile
            } else {
                newTileLocation = nextTileLocation;

                if (direction === "up") {
                    newTileLocation.rowNumber += 1;
                } else if (direction === "down") {
                    newTileLocation.rowNumber -= 1;
                } else if (direction === "left") {
                    newTileLocation.cellNumber += 1;
                } else if (direction === "right") {
                    newTileLocation.cellNumber -= 1;
                }
            }
            return newTileLocation;
        }

        changeTileLocation(locationData) {
            var currentLocationData = {
                rowNumber: this.location.rowNumber,
                cellNumber: this.location.cellNumber
            };
            var newLocationData = {
                rowNumber: 0,
                cellNumber: 0
            };

            if (
                locationData.rowNumber < 1
                || locationData.rowNumber > 4
                || locationData.cellNumber < 1
                || locationData.cellNumber > 4
            ) {
                throw "Trying to move tile to invalid coordinates: Outside of the game field";
            } else {
                newLocationData.rowNumber = locationData.rowNumber;
                newLocationData.cellNumber = locationData.cellNumber;
            }

            this.location.rowNumber = newLocationData.rowNumber;
            this.location.cellNumber = newLocationData.cellNumber;

            MainGame.gameObject.tilesData[currentLocationData.rowNumber][currentLocationData.cellNumber] = null;
            MainGame.gameObject.tilesData[newLocationData.rowNumber][newLocationData.cellNumber] = this;
            MainGame.gameObject.renderGameTiles();
        }

        lookForTheNextTile(direction) {
            var locationOfTheNextTile = {
                rowNumber: this.location.rowNumber,
                cellNumber: this.location.cellNumber
            };

            if (!['up', 'down', 'left', 'right'].includes(direction)) {
                throw "Trying to look for the next game tile in unknown direction";
            }

            // return FALSE if current tile already last in specified direction
            if (
                (direction === "up" && this.location.rowNumber === 0)
                || (direction === "down" && this.location.rowNumber === 4)
                || (direction === "left" && this.location.cellNumber === 0)
                || (direction === "right" && this.location.cellNumber === 4)
            ) {
                return false;
            }

            do {
                if (direction === "up") {
                    locationOfTheNextTile.rowNumber -= 1;
                } else if (direction === "down") {
                    locationOfTheNextTile.rowNumber += 1;
                } else if (direction === "left") {
                    locationOfTheNextTile.cellNumber -= 1;
                } else if (direction === "right") {
                    locationOfTheNextTile.cellNumber += 1;
                }

                if (
                    locationOfTheNextTile.rowNumber < 1
                    || locationOfTheNextTile.rowNumber > 4
                    || locationOfTheNextTile.cellNumber < 1
                    || locationOfTheNextTile.cellNumber > 4
                ) {
                    break;
                } else if (
                    MainGame.gameObject.tilesData[locationOfTheNextTile.rowNumber][locationOfTheNextTile.cellNumber] !== null
                ) {
                    return locationOfTheNextTile;
                }
            } while (
                MainGame.gameObject.tilesData[locationOfTheNextTile.rowNumber][locationOfTheNextTile.cellNumber] === null
            );

            return null;
        }

        checkForPossibilityOfTheCombining(combiningDirection) {
            let locationOfTileToBeCombinedWith = {
                rowNumber: 0,
                cellNumber: 0
            };

            if (!['up', 'down', 'left', 'right'].includes(combiningDirection)) {
                throw "Trying to combine game tile in unknown direction";
            }

            locationOfTileToBeCombinedWith = this.lookForTheNextTile(combiningDirection);
            if (locationOfTileToBeCombinedWith !== null && locationOfTileToBeCombinedWith !== false) {
                if (MainGame.gameObject.tilesData[locationOfTileToBeCombinedWith.rowNumber][locationOfTileToBeCombinedWith.cellNumber].score !== this.score) {
                    // return FALSE if tile in the direction of combining has different score
                    return false;
                } else {
                    // return TRUE if tile in the direction of combining exists and has the same score
                    return true;
                }
            } else {
                // return FALSE if no tile was found in the direction of combining
                return false;
            }
        }

        combineTiles(combiningDirection) {
            let locationOfTileToBeCombinedWith = {
                rowNumber: 0,
                cellNumber: 0
            };

            if (!['up', 'down', 'left', 'right'].includes(combiningDirection)) {
                throw "Trying to combine game tiles in unknown direction";
            }

            let combiningIsPossible = this.checkForPossibilityOfTheCombining(combiningDirection);

            if (combiningIsPossible === false) {
                return false;
            }

            locationOfTileToBeCombinedWith = this.lookForTheNextTile(combiningDirection);
            MainGame.gameObject.tilesData[locationOfTileToBeCombinedWith.rowNumber][locationOfTileToBeCombinedWith.cellNumber].upgradeTile();
            this.destroyTile();
            return true;
        }
    }

    try {
        var game = new MainGame();
    } catch (exception) {
        alert(exception);
    }
});
