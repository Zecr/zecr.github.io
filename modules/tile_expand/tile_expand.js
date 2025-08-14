// WORK IN PROGRESS

var topTileY;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function center_tile(enableBoolean, tile, boundingClient, otherTiles) {
    const offsetX = window.innerWidth / 2 - tile.offsetWidth / 2 - boundingClient.left;
    const offsetY = topTileY - boundingClient.top;

    if (enableBoolean) {
        tile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        await delay(500);
        tile_transition(true, tile, otherTiles);
    } else {
        tile_transition(false, tile, otherTiles, offsetX, offsetY);

        await delay(20);
        tile.style.transform = "";
    }
}

async function tile_transition(enableBoolean, tile, otherTiles, offX, offY) {
    tile.style.transitionDuration = "0s";

    if (enableBoolean) {
        otherTiles.forEach((tile) => {
            tile.style.display = "none";
        });
        tile.style.transform = "";
    } else {
        tile.style.transform = `translate(${offX}px, ${offY}px)`;
        otherTiles.forEach((tile) => {
            tile.style.display = "";
        });
    }

    await delay(20);
    tile.style.transitionDuration = "";
}

function tile_fade(enableBoolean, tiles) {
    if (enableBoolean) {
        tiles.forEach((tile) => {
            tile.style.opacity = "0";
        });
    } else {
        tiles.forEach((tile) => {
            tile.style.opacity = "";
        });
    }
}

async function tile_expand(enableBoolean, tile) {
    if (enableBoolean) {
        tile.initialWidth = getComputedStyle(tile).width;
        tile.initialHeight = getComputedStyle(tile).height;
        var desc_height = await get_description_height(tile);

        tile.style.width = tile.initialWidth;
        tile.style.height = tile.initialHeight;
        await delay(20);
        tile.style.width = "90%";
        tile.style.height = desc_height;
        await delay(500);

        description_show(true, tile);
    } else {
        await description_show(false, tile);

        tile.style.width = tile.initialWidth;
        tile.style.height = tile.initialHeight;
        await delay(500);
        tile.style.width = "";
        tile.style.height = "";
    }
}

async function get_description_height(tile) {
    var description = tile.querySelector(".description");
    tile.style.transitionDuration = "0s";
    description.style.opacity = "0";
    description.style.display = "block";
    var expanded_height = getComputedStyle(tile).height;;
    description.style.display = "none";
    description.style.opacity = "";
    tile.style.transitionDuration = "";
    return expanded_height;
}

async function description_show(enableBoolean, tile) {
    var description = tile.querySelector(".description");
    if (enableBoolean) {
        description.style.opacity = "0";
        description.style.display = "block";
        await delay(20);
        description.style.opacity = "";
        void tile.offsetHeight;
    } else {
        description.style.opacity = "0";
        await delay(500);
        description.style.display = "";
        description.style.opacity = "";
        void tile.offsetHeight;
    }
}

// Select all the tiles
var tiles = document.querySelectorAll(".tile");

// Add a click event listener to each tile
tiles.forEach((tile, index) => {
    // Add a state to the tile
    tile.isExpanded = false;
    tile.initialBoundingRect = null;
    const otherTiles = [...tiles].filter((_, i) => i !== index);

    tile.addEventListener("click", async function () {
        // Disable pointer events on all tiles
        tiles.forEach(tile => tile.style.pointerEvents = "none");
        
        description_show(false, tile);

        const tileBoundingRect = tile.getBoundingClientRect();
        // If the tile is expanded, revert it to the previous state
        if (tile.isExpanded) {
            topTileY = tile.getBoundingClientRect().top;
            await tile_expand(false, tile);

            center_tile(false, tile, tile.initialBoundingRect, otherTiles);

            await delay(500);
            tile_fade(false, otherTiles);
            tile.classList.remove("selected");

            tile.isExpanded = false;
        } else {
            // Save current position of tile
            topTileY = tiles[0].getBoundingClientRect().top;
            tile.initialBoundingRect = tileBoundingRect;
            tile.classList.add("selected");
            tile_fade(true, otherTiles, tile);

            // After animation has finished, move the clicked tile to the center of the page
            await delay(500);
            center_tile(true, tile, tileBoundingRect, otherTiles);
            await delay(500);
            tile_expand(true, tile);            

            tile.isExpanded = true;
        }

        await delay(200);
        // Re-enable pointer events on all tiles
        tiles.forEach(tile => tile.style.pointerEvents = "");
    });
});
