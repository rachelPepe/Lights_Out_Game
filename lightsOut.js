// add event listener for the DOMcontentLoaded event
window.addEventListener("DOMContentLoaded", domLoaded);



// game object declaration
const currentGame = {
    "rowCount": 3,
    "columnCount": 3,
    "lights": [
        true, true, true,
        true, true, true,
        true, true, true
    ],
    "startTime": new Date()
};



// GAME LOGIC - allLightsOut() and toggle() functions

// returns true if all lights in the game grid are off, false otherwise
function allLightsOut(game) {
    for (let i = 0; i < game.lights.length; i++) {
        // checks all lights, if even one is on, returns false
        if (game.lights[i]) {
            return false;
        }
    }

    // all lights checked and none are on
    return true;
}

// Toggles the light at (row, column) and each perpendicular light
function toggle(game, row, column) {
    const locations = [
        [row, column], [row - 1, column], [row + 1, column], 
        [row, column - 1], [row, column + 1]
        ];
        for (let location of locations) {
            row = location[0];
            column = location[1];
            if (row >= 0 && row < game.rowCount && 
                column >= 0 && column < game.columnCount) {
                    // compute array index
                    const index = row * game.columnCount + column;
            

            // toggle the light
            game.lights[index] = !game.lights[index];
        }
    }
}



// GAME INPUT AND UI FUNCTIONS

/* checks to see if game is won. If so, a message is displayed in the 
information div and true is returned, otherwise false is returned */
function checkForWin (game) {
    if (allLightsOut(game)) {
        // calculate time taken to complete puzzle
        const now = new Date();
        const timeTaken = Math.floor((now - game.startTime) / 1000);

        // displays message using div w/ #information
        const infoDIV = document.getElementById("information");
        infoDIV.innerHTML ="You won!! Solved in:" + timeTaken + " seconds";

        return true; // game won
    }

    return false // game not yet won
}

/* handles click at specified location, toggles lights, updates HTML grid on page,
and checks to see if game is won */
function clickLight(game, row, column) {
    if (allLightsOut(game)) {
        return;
    }

    // toggles appropriate lights
    toggle(game, row, column);

    // update HTML grid
    updateGridButtons(game)

    // check to see if game is won
    checkForWin(game)
}

/* creates the grid of buttons that represents the lights and clears the
informaiton div */
function createGameBoard(game, is5x5) {
    // get grid div and clear existing content
    const gameGrid = document.getElementById("gameGrid");
    gameGrid.innerHTML = "";

    // set layout style based on game size
    gameGrid.className = is5x5? "grid5x5" : "grid3x3";

    // create the grid of buttons
    for (let row = 0; row < game.rowCount; row++) {
        for (let column = 0; column < game.columnCount; column++) {
            // create the button and append as child to gameGrid
            const button = document.createElement("input")
            button.type = "button";
            gameGrid.appendChild(button);

            // set button's click event handler
            button.addEventListener("click", (e) => {
                clickLight(game, row, column);
            });
        }
    }

    // update button styles from game.lights array
    updateGridButtons(game);

    // clear the information div
    const infoDIV = document.getElementById("information");
    infoDIV.innerHTML = "";
}

/* called when the page's DOM content loads, adds event listeners 
and starts new 3x3 game */
function domLoaded() {
    // add click event listeners for the two new game buttons
    const btn3x3 = document.getElementById("newGame3x3Button");
    btn3x3.addEventListener("click", function() {
        newGame(currentGame, false);
    });
    const btn5x5 = document.getElementById("newGame5x5Button");
    btn5x5.addEventListener("click", function() {
        newGame(currentGame, true);
    });

    // start new 3x3 game
    newGame(currentGame, false);
}


// resets to a random winnable game with at least 1 light on 
function newGame(game, is5x5) {
    // sets the number of rows and columns
    if (is5x5) {
        game.rowCount = 5;
        game.columnCount = 5;
    }
    else {
        game.rowCount = 3;
        game.columnCount = 3;
    }

    // allocate the light array with all lights off 
    const lightCount = game.rowCount * game.columnCount;
    game.lights = [];
    for (let i = 0; i < lightCount; i++) {
        game.lights.push(false);
    }

    // perform a series of random toggles which generates grid gauranteed to win 
    while (allLightsOut(game)) {
        // generate random lights 
        for (let i = 0; i < 20; i++) {
            const randRow = Math.floor(Math.random() * game.rowCount);
            const randCol = Math.floor(Math.random() * game.columnCount);

            // toggle at the location
            toggle(game, randRow, randCol);
        }
    }

    // create UI
    createGameBoard(game, is5x5);

    // store the start time
    game.startTime = new Date()
}


// updates the HTML grid's buttons based on game.lights
function updateGridButtons(game) {
    // get the game grid div 
    const gameGrid = document.getElementById("gameGrid");

    // update grid buttons based on the game's light array entries
    for (let i = 0; i < game.lights.length; i++) {
        // update the buttons style based on the light state
        const button = gameGrid.children[i];
        button.className = game.lights[i] ? "lightOn" : "lightOff";
    }
}
