// ========== INITIALIZATION ========== //
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 600;

// Game settings
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
let OBSTACLE_GAP = 150;
const OBSTACLE_WIDTH = 60;
const BASE_SPEED = 3;

// Game state
let bat = { x: 100, y: canvas.height/2, width: 40, height: 30, velocity: 0, wingAngle: 0 };
let obstacles = [];
let score = 0;
let gameSpeed = BASE_SPEED;
let isGameRunning = false;
let animationId;

// ========== GAME FUNCTIONS ========== //
function createObstacle() {
    const gapPosition = Math.random() * (canvas.height - OBSTACLE_GAP - 100) + 50;
    obstacles.push({
        x: canvas.width,
        topHeight: gapPosition,
        bottomY: gapPosition + OBSTACLE_GAP,
        width: OBSTACLE_WIDTH,
        passed: false
    });
}

function drawBat() {
    ctx.save();
    ctx.translate(bat.x, bat.y);
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.ellipse(0, 0, bat.width/2, bat.height/2, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#7209b7';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-bat.width*1.5*Math.cos(bat.wingAngle), -bat.height*Math.sin(bat.wingAngle), 0, -bat.height*1.5);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(bat.width*1.5*Math.cos(bat.wingAngle), -bat.height*Math.sin(bat.wingAngle), 0, -bat.height*1.5);
    ctx.fill();
    
    bat.wingAngle += 0.2;
    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#4cc9f0';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
        ctx.fillRect(obstacle.x, obstacle.bottomY, obstacle.width, canvas.height-obstacle.bottomY);
    });
}

function update() {
    if (!isGameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update bat
    bat.velocity += GRAVITY;
    bat.y += bat.velocity;
    
    // Check collisions
    if (bat.y - bat.height/2 < 0 || bat.y + bat.height/2 > canvas.height) {
        endGame();
        return;
    }
    
    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
        
        if (!obstacle.passed && bat.x > obstacle.x + obstacle.width) {
            obstacle.passed = true;
            score++;
            document.getElementById('score-sound').play().catch(e => console.log(e));
        }
    });
    
    // Remove off-screen obstacles
    obstacles = obstacles.filter(ob => ob.x + ob.width > 0);
    
    // Add new obstacles
    if (obstacles.length < 2 || obstacles[obstacles.length-1].x < canvas.width - 300) {
        createObstacle();
    }
    
    drawObstacles();
    drawBat();
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px "Press Start 2P"';
    ctx.fillText(score.toString(), 20, 40);
    
    animationId = requestAnimationFrame(update);
}

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    isGameRunning = true;
    resetGame();
    document.getElementById('bg-music').play().catch(e => console.log(e));
    update();
}

function resetGame() {
    bat.y = canvas.height/2;
    bat.velocity = 0;
    obstacles = [];
    score = 0;
    gameSpeed = BASE_SPEED;
    createObstacle();
}

function endGame() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);
    document.getElementById('hit-sound').play();
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('final-score').textContent = score;
    
    // Update high score
    const highScore = Math.max(score, localStorage.getItem('flappyBatHighScore') || 0);
    localStorage.setItem('flappyBatHighScore', highScore);
    document.getElementById('high-score').textContent = highScore;
}

// ========== EVENT LISTENERS ========== //
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
canvas.addEventListener('click', () => {
    if (isGameRunning) {
        bat.velocity = JUMP_FORCE;
        document.getElementById('flap-sound').play().catch(e => console.log(e));
    }
});
