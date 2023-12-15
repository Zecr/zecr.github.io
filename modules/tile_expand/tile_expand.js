// WORK IN PROGRESS

function center_tile(enableBoolean, tile, boundingClient) {
    const offsetX = window.innerWidth / 2 - tile.offsetWidth / 2 - boundingClient.left;
    const offsetY = window.innerHeight / 2 - tile.offsetHeight / 2 - boundingClient.top;
    if (enableBoolean) {
        tile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        setTimeout(() => {
            tile_transition(true, tile);
        }, 500);
    } else {
        tile_transition(false, tile, offsetX, offsetY);

        setTimeout(() => {
            tile.style.transform = "";
        }, 500);
    }
}

function tile_transition(enableBoolean, tile, offX, offY) {
    tile.style.transitionDuration = "0s";

    if (enableBoolean) {
        Object.assign(tile.style, {
            transform: "",
            position: "absolute",
            top: `${window.innerHeight / 2 - tile.offsetHeight / 2}px`,
            left: `${window.innerWidth / 2 - tile.offsetWidth / 2}px`,
        });
    } else {
        Object.assign(tile.style, {
            transform: `translate(${offX}px, ${offY}px)`,
            position: "",
            top: "",
            left: "",
        });
    }

    setTimeout(() => {
        tile.style.transitionDuration = "";
    }, 20);
}

function tile_fade(enableBoolean, tiles) {
    if (enableBoolean) {
        tiles.forEach((tile) => {
            tile.style.opacity = "0";
            tile.style.pointerEvents = "none";
        });
    } else {
        tiles.forEach((tile) => {
            tile.style.opacity = "";
            tile.style.pointerEvents = "";
        });
    }
}

// Select all the tiles
const tiles = document.querySelectorAll(".tile");

// Add a click event listener to each tile
tiles.forEach((tile, index) => {
    // Add a state to the tile
    tile.isExpanded = false;
    tile.initialBoundingRect = null;
    const otherTiles = [...tiles].filter((_, i) => i !== index);

    tile.addEventListener("click", function () {
        const tileBoundingRect = tile.getBoundingClientRect();
        // If the tile is expanded, revert it to the previous state
        if (tile.isExpanded) {
            center_tile(false, tile, tile.initialBoundingRect);

            setTimeout(() => {
                tile_fade(false, otherTiles);
            }, 500);

            tile.isExpanded = false;
        } else {
            // Save current position of tile
            tile.initialBoundingRect = tileBoundingRect;
            tile_fade(true, otherTiles);

            // After animation has finished, move the clicked tile to the center of the page
            setTimeout(() => {
                center_tile(true, tile, tileBoundingRect);
            }, 500);

            tile.isExpanded = true;
        }
    });
});
