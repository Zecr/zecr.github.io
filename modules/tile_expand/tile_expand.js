// Revised edition rewritten by AI

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getTopRowY(tiles) {
  if (!tiles || tiles.length === 0) return 0;
  return tiles[0].getBoundingClientRect().top;
}

async function center_tile(enableBoolean, tile, tiles, otherTiles) {
  if (enableBoolean) {
    // 1) Move the clicked tile to the visual center (with others visible)
    const rect = tile.getBoundingClientRect();
    const topRowY = getTopRowY(tiles);
    const dx = window.innerWidth / 2 - rect.left - rect.width / 2;
    const dy = topRowY - rect.top;

    tile.style.transform = `translate(${dx}px, ${dy}px)`;
    await delay(500);

    // 2) Hide other tiles without visual jumping (FLIP after hide)
    await isolate_tile(tile, otherTiles);
  } else {
    // Bring the grid back and animate tile into its new spot (FLIP before/after show)
    await reunite_tiles(tile, otherTiles);
    await delay(20);
    tile.style.transform = ""; // animate back to grid
  }
}

async function isolate_tile(tile, otherTiles) {
  // Hide others and snap the tile in place without visible jumps
  tile.style.transitionDuration = "0s";
  const before = tile.getBoundingClientRect();

  otherTiles.forEach((t) => (t.style.display = "none"));

  const after = tile.getBoundingClientRect();
  const dx = before.left - after.left;
  const dy = before.top - after.top;

  // Counter the layout shift, then snap to the new layout position
  tile.style.transform = `translate(${dx}px, ${dy}px)`;
  void tile.offsetHeight;
  tile.style.transform = ""; // snap (no animation)
  tile.style.transitionDuration = "";
}

async function reunite_tiles(tile, otherTiles) {
  // Show others using FLIP so the tile doesn't jump
  const before = tile.getBoundingClientRect();
  otherTiles.forEach((t) => (t.style.display = ""));
  const after = tile.getBoundingClientRect();

  const dx = before.left - after.left;
  const dy = before.top - after.top;

  tile.style.transitionDuration = "0s";
  tile.style.transform = `translate(${dx}px, ${dy}px)`;
  void tile.offsetHeight; // reflow
  tile.style.transitionDuration = ""; // restore transitions
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
  const description = tile.querySelector(".description");

  if (enableBoolean) {
    // Lock current size so we can animate width/height
    const startW = getComputedStyle(tile).width;
    const startH = getComputedStyle(tile).height;
    tile.style.width = startW;
    tile.style.height = startH;
    await delay(20);

    // Measure target expanded height at the expanded width (90%)
    const prevTD = tile.style.transitionDuration;
    tile.style.transitionDuration = "0s";

    const prevDescDisplay = description.style.display;
    const prevDescOpacity = description.style.opacity;

    description.style.display = "block";
    description.style.opacity = "0";

    const prevW = tile.style.width;
    tile.style.width = "90%";
    const endH = getComputedStyle(tile).height;

    // Reset to the starting state instantly
    tile.style.width = prevW;
    description.style.display = prevDescDisplay || "";
    description.style.opacity = prevDescOpacity || "";
    tile.style.transitionDuration = prevTD;
    void tile.offsetHeight;

    // Animate to expanded
    tile.style.width = "90%";
    tile.style.height = endH;
    await delay(500);

    await description_show(true, tile);
  } else {
    // Collapse to the current natural size (post-resize), not to a stale size
    await description_show(false, tile);

    const prevTD = tile.style.transitionDuration;
    tile.style.transitionDuration = "0s";

    // Snapshot current expanded size
    const expandedW = getComputedStyle(tile).width;
    const expandedH = getComputedStyle(tile).height;

    // Measure natural collapsed size with styles cleared
    tile.style.width = "";
    tile.style.height = "";
    const collapsedW = getComputedStyle(tile).width;
    const collapsedH = getComputedStyle(tile).height;

    // Jump back to expanded instantly
    tile.style.width = expandedW;
    tile.style.height = expandedH;

    tile.style.transitionDuration = prevTD;
    void tile.offsetHeight;

    // Animate to the current collapsed size
    tile.style.width = collapsedW;
    tile.style.height = collapsedH;
    await delay(500);

    tile.style.width = "";
    tile.style.height = "";
  }
}

async function description_show(enableBoolean, tile) {
  const description = tile.querySelector(".description");
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
const tiles = document.querySelectorAll(".tile");

// Add a click event listener to each tile
tiles.forEach((tile, index) => {
  tile.isExpanded = false;
  const otherTiles = [...tiles].filter((_, i) => i !== index);

  tile.addEventListener("click", async function () {
    // Disable pointer events on all tiles
    tiles.forEach((t) => (t.style.pointerEvents = "none"));

    description_show(false, tile);

    if (tile.isExpanded) {
      // Collapse details first
      await tile_expand(false, tile);

      // Return to grid (robust even after resize)
      await center_tile(false, tile, tiles, otherTiles);

      await delay(500);
      tile_fade(false, otherTiles);
      tile.classList.remove("selected");
      tile.isExpanded = false;
    } else {
      tile.classList.add("selected");
      tile_fade(true, otherTiles, tile);

      // Move to center and isolate
      await delay(500);
      await center_tile(true, tile, tiles, otherTiles);

      // Expand
      await delay(500);
      await tile_expand(true, tile);

      tile.isExpanded = true;
    }

    await delay(200);
    // Re-enable pointer events on all tiles
    tiles.forEach((t) => (t.style.pointerEvents = ""));
  });
});

// Optional: if you want to gracefully handle live resizing mid-expanded state,
// you generally don't need to do anything special now because we re-measure on close.
// But you can debounce a no-op to avoid thrashing work during resize:
let _resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    // Intentionally empty: close/open remains robust thanks to re-measuring.
  }, 150);
});