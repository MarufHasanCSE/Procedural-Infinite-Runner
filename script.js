const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

let score = 0;
let gameSpeed = 5;
let isGameOver = false;

const player = {
    x: 50,
    y: 200,
    w: 40,
    h: 40,
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false
};

const obstacles = [];

function spawnObstacle() {
    const height = 30 + Math.random() * 40;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        w: 20,
        h: height
    });
}

function update() {
    if (isGameOver) return;

    score += 0.1;
    scoreEl.textContent = Math.floor(score) + "m";
    gameSpeed += 0.001;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.x -= gameSpeed;

        if (player.x < o.x + o.w &&
            player.x + player.w > o.x &&
            player.y < o.y + o.h &&
            player.y + player.h > o.y) {
            isGameOver = true;
            alert("Game Over! Distance: " + Math.floor(score) + "m");
            location.reload();
        }

        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(player.x, player.y, player.w, player.h);

    ctx.fillStyle = '#f43f5e';
    obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.w, o.h);
    });

    update();
    requestAnimationFrame(draw);
}

window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
});

let spawnTimer = 0;
function gameLoop() {
    spawnTimer++;
    let nextSpawn = Math.max(40, 100 - Math.floor(gameSpeed * 2));
    
    if (spawnTimer > nextSpawn) {
        spawnObstacle();
        spawnTimer = 0;
    }
    draw();
}

setInterval(gameLoop, 1000/60); 