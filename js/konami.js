// The secret Konami Code sequence
const konamiCode = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a"
];

let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    // Get the key pressed
    const key = e.key;

    // Check if the key matches the current expected key in the sequence
    if (key === konamiCode[konamiIndex]) {
        // Move to the next key in the sequence
        konamiIndex++;

        // If the entire sequence is entered correctly
        if (konamiIndex === konamiCode.length) {
            activateKonami();
            // Reset index to allow triggering it again
            konamiIndex = 0;
        }
    } else {
        // If the key is wrong, reset the index
        konamiIndex = 0;
    }
});

function activateKonami() {
    console.log("Konami Code Activated! Do a barrel roll!");
    const body = document.body;

    // Add the class to trigger the animation
    body.classList.add('barrel-roll');

    // Remove the class after the animation completes so it can be triggered again
    setTimeout(() => {
        body.classList.remove('barrel-roll');
    }, 2000); // Matches the 2s animation duration
}

/**
 * Easter Egg 2: Console Signature
 * A fun message for developers who check the console.
 */
console.log(
    "%c🚀 Hello there, Explorer! 🌌",
    "color: #8a2be2; font-size: 20px; font-weight: bold; background: #f0f0f0; padding: 10px; border-radius: 5px;"
);
console.log(
    "%cIf you're looking for the source code, you're already in the right place (Github). Feel free to look around!",
    "color: #333; font-size: 12px;"
);
console.log(
    "%cTry entering the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A) for a spin!",
    "color: #e67e22; font-style: italic;"
);


/**
 * Easter Egg 3: Tab Title Marquee
 * Changes the document title when the user switches tabs.
 */
const originalTitle = document.title;
const funTitles = [
    "Miss you already! 🚀",
    "Drifting in space... 🛸",
    "Come back to Earth! 🌍",
    "System: Offline 🌑"
];

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pick a random fun title
        const randomTitle = funTitles[Math.floor(Math.random() * funTitles.length)];
        document.title = randomTitle;
    } else {
        // Restore original title
        document.title = originalTitle;
    }
});
