let currentIndex = 0;
const buttons = document.querySelectorAll(".button-item");

// Show only one button at a time
function updateButtonVisibility() {
    buttons.forEach((button, index) => {
        button.style.display = (index === currentIndex) ? "inline-block" : "none";
    });
}

// Show next button
function showNext() {
    currentIndex++;
    if (currentIndex >= buttons.length) {
        currentIndex = 0;
    }
    updateButtonVisibility();
}

// Show previous button
function showPrevious() {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = buttons.length - 1;
    }
    updateButtonVisibility();
}

// Toggle the visibility of the hidden buttons
function toggleButtons() {
    const hiddenButtons = document.querySelector(".hidden-buttons");
    hiddenButtons.style.display = hiddenButtons.style.display === "flex" ? "none" : "flex";
    updateButtonVisibility(); // Ensure only one button is visible when the section is revealed
}

// Initialize the button visibility
updateButtonVisibility();
