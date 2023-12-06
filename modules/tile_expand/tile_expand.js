// WORK IN PROGRESS


// Select all the tiles
const tiles = document.querySelectorAll(".tile");

// Add a click event listener to each tile
tiles.forEach((tile) => {
    // Add a state to the tile
    tile.isExpanded = false;

    tile.addEventListener("click", function () {
        // If the tile is expanded, revert it to the previous state
        if (tile.isExpanded) {
            tile.style.transform = "";
            const description = tile.querySelector(".description");
            if (description) {
                description.style.display = "";
            }
            tiles.forEach((otherTile) => {
                otherTile.style.opacity = "";
                // make unselected tiles clickable again
                otherTile.style.pointerEvents = "";
            });
            tile.isExpanded = false;
        } else {
            // If the tile is not expanded, hide the other tiles
            tiles.forEach((otherTile) => {
                if (otherTile !== tile) {
                    otherTile.style.opacity = "0";
                    // make unselected tiles unclickable
                    otherTile.style.pointerEvents = "none";
                }
            });

            // After a delay of 0.3 seconds, move the clicked tile to the center of the page
            setTimeout(() => {
                const centerX = window.innerWidth / 2 - tile.offsetWidth / 2;
                const centerY = window.innerHeight / 2 - tile.offsetHeight / 2;
                const rect = tile.getBoundingClientRect();
                const offsetX = centerX - rect.left;
                const offsetY = centerY - rect.top;
                tile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                tile.isExpanded = true;

                // Replace the transform centering with display:relative centering "calc(50% - elementWidth/2)"
                setTimeout(() => {
                    tile.style.transform = '';
                    tile.display = 'relative';
                    tile.style.left = 'calc(50% - 7.5em)';
                    tile.style.top = '50%';
                    /// ... I think I need to find another approach
                }, 300);
            }, 300);
        }
    });
});