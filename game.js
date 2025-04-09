// Game State
let isGameRunning = false;
let audioEnabled = false;

// Audio Helper
function playSound(id) {
    if (!audioEnabled) return;
    const sound = document.getElementById(id);
    sound.currentTime = 0;
    sound.play().catch(e => console.log(id, "error:", e));
}

// Initialize Game
function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        audioEnabled = true;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('bg-music').play();
        update();
    }
}

// Jump Function
function jump() {
    if (!isGameRunning) return;
    bat.velocity = JUMP_FORCE;
    playSound('flap-sound');
}

// [Keep all your existing game logic below]
// (Collision detection, scoring, obstacle generation, etc.)
