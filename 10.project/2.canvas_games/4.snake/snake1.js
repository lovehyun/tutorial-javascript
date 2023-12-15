const canvas = document.getElementById('snakeCanvas');
const context = canvas.getContext('2d');
const blockSize = 20;
const canvasSize = 300;
const snakeSpeed = 200; // milliseconds

let snake = [
    { x: 0, y: 0 },
];
let direction = 'right';
let food = generateFood();
let gameover = false;

function draw() {
    context.clearRect(0, 0, canvasSize, canvasSize);

    if (gameover) {
        context.fillStyle = '#F00';
        context.font = '30px Arial';
        context.fillText('Game Over', 80, canvasSize / 2);
        return;
    }

    drawSnake();
    drawFood();

    moveSnake();
    checkCollision();
    checkFood();
}

function drawSnake() {
    context.fillStyle = '#00F';
    snake.forEach(segment => {
        context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

function drawFood() {
    context.fillStyle = '#F00';
    context.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    snake.unshift(head);
}

function checkCollision() {
    if (gameover) {
        return;
    }

    const head = snake[0];
    if (
        head.x < 0 ||
        head.x >= canvasSize / blockSize ||
        head.y < 0 ||
        head.y >= canvasSize / blockSize ||
        isSnakeCollision()
    ) {
        gameover = true;
    }
}

function isSnakeCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function checkFood() {
    const head = snake[0];
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    let foodPosition;
    do {
        foodPosition = {
            x: Math.floor(Math.random() * (canvasSize / blockSize)),
            y: Math.floor(Math.random() * (canvasSize / blockSize)),
        };
    } while (isFoodOnSnake(foodPosition));

    return foodPosition;
}

function isFoodOnSnake(foodPosition) {
    return snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y);
}

function resetGame() {
    snake = [{ x: 0, y: 0 }];
    direction = 'right';
    food = generateFood();
    gameover = false;
}

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (gameover) {
        resetGame();
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
}

setInterval(draw, snakeSpeed);
