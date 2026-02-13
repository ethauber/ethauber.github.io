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
