
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

// returns true id all lights in the game grid are off, false otherwise
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

