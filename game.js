
// Game Variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

// Game Settings
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
let OBSTACLE_GAP = 150;
const OBSTACLE_WIDTH = 60;
const BASE_SPEED = 3;

// Game Objects
let bat = {
    x: 100,
    y: canvas.height / 2,
    width: 40,
    height: 30,
    velocity: 0,
    wingAngle: 0
};

let obstacles = [];
let score = 0;
let gameSpeed = BASE_SPEED;
let isGameRunning = false;
let animationId;

// Start Game Function
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    isGameRunning = true;
    resetGame();
    update();
}

// Reset Game State
function resetGame() {
    bat.y = canvas.height / 2;
    bat.velocity = 0;
    obstacles = [];
    score = 0;
    gameSpeed = BASE_SPEED;
    createObstacle();
}

// [Keep all your existing game functions...]
// (drawBat(), drawObstacles(), createObstacle(), etc.)

// Modified Jump Function
function jump() {
    if (!isGameRunning) return;
    bat.velocity = JUMP_FORCE;
    document.getElementById('flap-sound').play().catch(e => console.log(e));
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
canvas.addEventListener('click', jump);
canvas.addEventListener('touchstart', jump);
