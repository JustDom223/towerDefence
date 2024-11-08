// controls.js

// Initialize the preview state
let preview = {
    x: 0,
    y: 0,
    visible: false,
    color: 'rgba(0, 0, 255, 0.3)', // Default to blue for valid placement
};

/**
 * Initializes game controls, handling mouse and touch events for tower placement.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @param {Object} dependencies - An object containing game state and utility functions.
 */
export function initControls(canvas, dependencies) {
    const {
        gold,
        deductGold,
        addTower,
        // displayNotEnoughGold,
        // displayCannotPlaceHere,
        isOnPath,
        isOnTower,
        isGameActive, // New dependency
    } = dependencies;

    // Flag to track if touch is active to prevent mouse events during touch
    let isTouchActive = false;

    // ------------------- Helper Function -------------------
    /**
     * Adjusts the y-coordinate for touch devices to prevent finger obstruction.
     * @param {number} y - Original y-coordinate.
     * @returns {number} - Adjusted y-coordinate.
     */
    function adjustYForTouch(y) {
        return y - 20; // Shift up by 10 pixels
    }

    // ------------------- Mouse Event Handlers -------------------
    
    // Handle mouse movement to update the preview position
    canvas.addEventListener('mousemove', function (event) {
        if (isTouchActive) return; // Ignore mouse events if touch is active
        if (!isGameActive()) {
            preview.visible = false;
            return; // Do not update preview if game is not active
        }

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        // Update preview position and visibility
        preview.x = x;
        preview.y = y; // No shift for mouse events
        const canPlace = !isOnPath(x, y) && !isOnTower(x, y);
        preview.visible = true;
        preview.color = canPlace ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
    });

    // Handle mouse click to place tower
    canvas.addEventListener('click', function (event) {
        if (isTouchActive) return; // Ignore mouse clicks if touch is active
        if (!isGameActive()) return; // Ignore tower placement if game is not active

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const canPlace = !isOnPath(x, y) && !isOnTower(x, y);
        if (canPlace) {
            if (gold.value >= 10) {
                addTower(x, y);
                deductGold(10);
            } else {
                console.log('Not enough gold')
                // displayNotEnoughGold();
            }
        } else {
            // displayCannotPlaceHere();
            console.log("Cannot place here")
        }
    });

    // ------------------- Touch Event Handlers -------------------

    // Handle touchstart to initiate tower placement preview
    canvas.addEventListener('touchstart', function (event) {
        isTouchActive = true;
        event.preventDefault(); // Prevent default touch behavior (like scrolling)

        if (!isGameActive()) {
            preview.visible = false;
            return; // Do not update preview if game is not active
        }

        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        // Update preview position and visibility with y adjustment
        preview.x = x;
        preview.y = adjustYForTouch(y); // Shift up by 10 pixels for touch
        const canPlace = !isOnPath(x, preview.y) && !isOnTower(x, preview.y);
        preview.visible = true;
        preview.color = canPlace ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
    }, { passive: false });

    // Handle touchmove to update tower placement preview position
    canvas.addEventListener('touchmove', function (event) {
        if (!isTouchActive) return;
        event.preventDefault(); // Prevent default touch behavior

        if (!isGameActive()) {
            preview.visible = false;
            return; // Do not update preview if game is not active
        }

        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        // Update preview position and visibility with y adjustment
        preview.x = x;
        preview.y = adjustYForTouch(y); // Shift up by 10 pixels for touch
        const canPlace = !isOnPath(x, preview.y) && !isOnTower(x, preview.y);
        preview.color = canPlace ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
    }, { passive: false });

    // Handle touchend to place tower if placement is valid
    canvas.addEventListener('touchend', function (event) {
        if (!isTouchActive) return;
        event.preventDefault(); // Prevent default touch behavior

        if (!isGameActive()) return; // Ignore tower placement if game is not active

        const x = preview.x;
        const y = preview.y; // Already adjusted in touchstart/move
        const canPlace = !isOnPath(x, y) && !isOnTower(x, y);

        if (canPlace) {
            if (gold.value >= 10) {
                addTower(x, y);
                deductGold(10);
            } else {
                displayNotEnoughGold();
            }
        } else {
            displayCannotPlaceHere();
        }

        // Reset preview visibility
        preview.visible = false;
        isTouchActive = false;
    }, { passive: false });
}

/**
 * Retrieves the current preview state.
 * @returns {Object} The preview state containing x, y coordinates, visibility, and color.
 */
export function getPreview() {
    return preview;
}
