const tileContainer = document.querySelector(".tiles");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const resetButton = document.getElementById("resetButton");

const colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown"];
const colorsPickList = [...colors, ...colors];
const tileCount = colorsPickList.length;

let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let score = 0;
let timer = 0;
let timerInterval;

function buildTile(color) {
    const element = document.createElement("div");
    element.classList.add("tile");
    element.setAttribute("data-color", color);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () => {
        const revealed = element.getAttribute("data-revealed");
        if (awaitingEndOfMove || revealed === "true" || element === activeTile) {
            return;
        }

        element.style.backgroundColor = color;

        if (!activeTile) {
            activeTile = element;
            return;
        }

        const colorMatch = activeTile.getAttribute("data-color");

        if (colorMatch === color) {
            activeTile.setAttribute("data-revealed", "true");
            element.setAttribute("data-revealed", "true");
            awaitingEndOfMove = false;
            activeTile = null;
            revealedCount += 2;
            score += 10;
            scoreElement.textContent = score;

            if (revealedCount === tileCount) {
                clearInterval(timerInterval);
                alert(`You win! Your score is ${score}. Refresh to play again.`);
            }
            return;
        }

        awaitingEndOfMove = true;
        setTimeout(() => {
            element.style.backgroundColor = null;
            activeTile.style.backgroundColor = null;

            awaitingEndOfMove = false;
            activeTile = null;
            score -= 2;
            if (score < 0) score = 0; // Ensure score doesn't go negative
            scoreElement.textContent = score;
        }, 1000);
    });

    return element;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer + " seconds";
    }, 1000);
}

resetButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timer = 0;
    timerElement.textContent = "0 seconds";
    score = 0;
    scoreElement.textContent = "0";
    revealedCount = 0;
    activeTile = null;
    awaitingEndOfMove = false;

    // Remove existing tiles
    while (tileContainer.firstChild) {
        tileContainer.removeChild(tileContainer.firstChild);
    }

    // Build new tiles
    for (let i = 0; i < tileCount; i++) {
        const randomIndex = Math.floor(Math.random() * colorsPickList.length);
        const color = colorsPickList[randomIndex];
        const tile = buildTile(color);

        colorsPickList.splice(randomIndex, 1);
        tileContainer.appendChild(tile);
    }

    startTimer();
    location.reload();
});

// Build Tiles and start the timer
for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPickList.length);
    const color = colorsPickList[randomIndex];
    const tile = buildTile(color);

    colorsPickList.splice(randomIndex, 1);
    tileContainer.appendChild(tile);
}

startTimer();
