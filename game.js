document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const finalScore = document.getElementById('final-score');
    const highScore = document.getElementById('high-score');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 600;
    
    // Game settings
    const GRAVITY = 0.5;
    const JUMP_FORCE = -10;
    let OBSTACLE_GAP = 150;
    const OBSTACLE_WIDTH = 60;
    const BASE_SPEED = 3;
    
    // Game variables
    let bat = {
        x: 100,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        velocity: 0,
        color: '#f72585',
        wingAngle: 0
    };
    
    let obstacles = [];
    let score = 0;
    let gameSpeed = BASE_SPEED;
    let isGameRunning = false;
    let animationId;
    let storedHighScore = localStorage.getItem('flappyBatHighScore') || 0;
    
    // Initialize game
    function initGame() {
        bat.y = canvas.height / 2;
        bat.velocity = 0;
        obstacles = [];
        score = 0;
        gameSpeed = BASE_SPEED;
        OBSTACLE_GAP = 150;
        createObstacle();
    }
    
    // Create new obstacle
    function createObstacle() {
        const gapPosition = Math.random() * (canvas.height - OBSTACLE_GAP - 100) + 50;
        
        obstacles.push({
            x: canvas.width,
            topHeight: gapPosition,
            bottomY: gapPosition + OBSTACLE_GAP,
            width: OBSTACLE_WIDTH,
            passed: false,
            color: '#4cc9f0'
        });
    }
    
    // Draw bat with wing animation
    function drawBat() {
        ctx.save();
        ctx.translate(bat.x, bat.y);
        
        // Body
        ctx.fillStyle = bat.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, bat.width / 2, bat.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings
        ctx.fillStyle = '#7209b7';
        ctx.beginPath();
        
        // Left wing
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
            -bat.width * 1.5 * Math.cos(bat.wingAngle), 
            -bat.height * Math.sin(bat.wingAngle), 
            0, 
            -bat.height * 1.5
        );
        
        // Right wing
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
            bat.width * 1.5 * Math.cos(bat.wingAngle), 
            -bat.height * Math.sin(bat.wingAngle), 
            0, 
            -bat.height * 1.5
        );
        
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-10, -5, 3, 0, Math.PI * 2);
        ctx.arc(10, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Wing animation
        bat.wingAngle += 0.2;
    }
    
    // Draw obstacles
    function drawObstacles() {
        obstacles.forEach(obstacle => {
            // Top obstacle
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
            
            // Bottom obstacle
            ctx.fillRect(obstacle.x, obstacle.bottomY, obstacle.width, canvas.height - obstacle.bottomY);
            
            // Obstacle edges
            ctx.fillStyle = '#3a0ca3';
            ctx.fillRect(obstacle.x - 3, 0, 3, obstacle.topHeight);
            ctx.fillRect(obstacle.x - 3, obstacle.bottomY, 3, canvas.height - obstacle.bottomY);
        });
    }
    
    // Update game state
    function update() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update bat position
        bat.velocity += GRAVITY;
        bat.y += bat.velocity;
        
        // Check for collisions with top and bottom
        if (bat.y - bat.height / 2 < 0 || bat.y + bat.height / 2 > canvas.height) {
            endGame();
            return;
        }
        
        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            // Check for collisions with obstacles
            if (
                bat.x + bat.width / 2 > obstacles[i].x &&
                bat.x - bat.width / 2 < obstacles[i].x + obstacles[i].width &&
                (bat.y - bat.height / 2 < obstacles[i].topHeight ||
                 bat.y + bat.height / 2 > obstacles[i].bottomY)
            ) {
                endGame();
                return;
            }
            
            // Check if bat passed the obstacle
            if (!obstacles[i].passed && bat.x > obstacles[i].x + obstacles[i].width) {
                obstacles[i].passed = true;
                score++;
                document.getElementById('score-sound').play();
                
                // Increase difficulty
                if (score % 3 === 0) {
                    gameSpeed += 0.2;
                }
                if (score % 5 === 0 && OBSTACLE_GAP > 100) {
                    OBSTACLE_GAP -= 5;
                }
            }
            
            // Remove obstacles that are off screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
        
        // Add new obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
            createObstacle();
        }
        
        // Draw everything
        drawObstacles();
        drawBat();
        
        // Draw score
        ctx.fillStyle = 'white';
        ctx.font = '24px "Press Start 2P"';
        ctx.fillText(score.toString(), 20, 40);
        
        // Continue animation
        if (isGameRunning) {
            animationId = requestAnimationFrame(update);
        }
    }
    
    // Handle jump
    function jump() {
        if (!isGameRunning) return;
        bat.velocity = JUMP_FORCE;
        document.getElementById('flap-sound').play();
    }
    
    // Start game
    function startGame() {
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        isGameRunning = true;
        initGame();
        document.getElementById('bg-music').play();
        update();
    }
    
    // End game
    function endGame() {
        isGameRunning = false;
        cancelAnimationFrame(animationId);
        document.getElementById('hit-sound').play();
        document.getElementById('bg-music').pause();
        
        // Update high score
        if (score > storedHighScore) {
            storedHighScore = score;
            localStorage.setItem('flappyBatHighScore', storedHighScore);
        }
        
        // Show game over screen
        finalScore.textContent = score;
        highScore.textContent = storedHighScore;
        gameOverScreen.style.display = 'flex';
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    canvas.addEventListener('click', jump);
    canvas.addEventListener('touchstart', jump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });
    
    // Initial display
    highScore.textContent = storedHighScore;
});
