const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const maze = [
    ['S', ' ', ' ', '#', ' ', 'E'],
    ['#', '#', ' ', '#', ' ', '#'],
    [' ', ' ', ' ', ' ', ' ', '#'],
    ['#', '#', ' ', '#', ' ', '#'],
    [' ', ' ', ' ', ' ', ' ', '#'],
];

let playerPosition = { x: 0, y: 0 }; // 시작 위치 (S)

function printMaze() {
    maze.forEach((row, rowIndex) => {
        let rowString = row
            .map((cell, colIndex) => {
                if (rowIndex === playerPosition.x && colIndex === playerPosition.y) {
                    return 'P'; // 플레이어 위치 표시
                }
                return cell;
            })
            .join(' ');
        console.log(rowString);
    });
    console.log('\n');
}

function movePlayer(direction) {
    let { x, y } = playerPosition;
    switch (direction) {
        case '위':
            if (x > 0 && maze[x - 1][y] !== '#') playerPosition.x--;
            break;
        case '아래':
            if (x < maze.length - 1 && maze[x + 1][y] !== '#') playerPosition.x++;
            break;
        case '왼쪽':
            if (y > 0 && maze[x][y - 1] !== '#') playerPosition.y--;
            break;
        case '오른쪽':
            if (y < maze[x].length - 1 && maze[x][y + 1] !== '#') playerPosition.y++;
            break;
        default:
            console.log("잘못된 방향입니다. '위', '아래', '왼쪽', '오른쪽' 중에서 입력하세요.");
    }

    if (maze[playerPosition.x][playerPosition.y] === 'E') {
        console.log('축하합니다! 미로를 탈출했습니다!');
        rl.close(); // 게임 종료
        return true;
    }

    return false;
}

function startGame() {
    printMaze();
    rl.question('방향을 입력하세요 (위/아래/왼쪽/오른쪽): ', (direction) => {
        const gameOver = movePlayer(direction);
        if (!gameOver) {
            startGame(); // 게임을 계속 진행
        }
    });
}

startGame();
