const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const multEl = document.getElementById('multiplier');

let score = 0;
let gameSpeed = 6;
let isGameOver = false;
let frameCount = 0;

const player = {
    x: 80,
    y: 300,
    w: 36,
    h: 36,
    dy: 0,
    jumpForce: -10,
    gravity: 0.5,
    jumpsLeft: 2,
    color: '#00f2ff'
};

let obstacles = [];
let particles = [];
let stars = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5 + 0.1
}));

function createExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1,
            color: player.color
        });
    }
}

function spawnObstacle() {
    const height = 40 + Math.random() * 60;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        w: 25,
        h: height,
        color: '#ff0055'
    });
}

function update() {
    if (isGameOver) return;

    score += gameSpeed / 10;
    gameSpeed += 0.0005;
    scoreEl.textContent = Math.floor(score).toString().padStart(5, '0');
    multEl.textContent = `x${(gameSpeed / 6).toFixed(1)}`;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.jumpsLeft = 2;
    }

    stars.forEach(s => {
        s.x -= s.speed * gameSpeed;
        if (s.x < 0) s.x = canvas.width;
    });

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.x -= gameSpeed;

        if (player.x < o.x + o.w &&
            player.x + player.w > o.x &&
            player.y < o.y + o.h &&
            player.y + player.h > o.y) {
            
            createExplosion(player.x + player.w/2, player.y + player.h/2);
            isGameOver = true;
            setTimeout(() => location.reload(), 1500);
        }

        if (o.x + o.w < 0) obstacles.splice(i, 1);
    }

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#111';
    stars.forEach(s => ctx.fillRect(s.x, s.y, s.size, s.size));

    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.shadowBlur = 0;

    obstacles.forEach(o => {
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.y, o.w, o.h);
    });

    particles.forEach(p => {
        ctx.fillStyle = `rgba(0, 242, 255, ${p.life})`;
        ctx.fillRect(p.x, p.y, 4, 4);
    });

    update();
    requestAnimationFrame(draw);
}

window.addEventListener('keydown', e => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && player.jumpsLeft > 0) {
        player.dy = player.jumpForce;
        player.jumpsLeft--;
    }
});

function gameLoop() {
    frameCount++;
    if (frameCount % Math.max(30, Math.floor(100 / (gameSpeed/5))) === 0) {
        spawnObstacle();
    }
    draw();
}

gameLoop();