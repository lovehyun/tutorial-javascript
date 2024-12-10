const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

    socket.emit('drawing', {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
    });
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

socket.on('drawing', (data) => {
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

socket.on('newWord', (word) => {
    console.log('New word to draw: ' + word);
});

document.getElementById('guessInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        socket.emit('guess', e.target.value);
        e.target.value = '';
    }
});

socket.on('correctGuess', (id) => {
    alert('Player ' + id + ' guessed correctly!');
});
