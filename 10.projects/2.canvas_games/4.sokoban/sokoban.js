// License: GPLv3
// Original Author: shpark (https://github.com/lovehyun/tutorial-javascript)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const rows = 6;
const cols = 10;

const player = {
    x: 0,
    y: 0,
};

let currentStage = 0;

const stages = [
    [
        "##########",
        "#        #",
        "#   $ .  #",
        "#   @    #",
        "#        #",
        "##########",
    ],
    [
        "##########",
        "#  @     #",
        "#  $     #",
        "#  ###   #",
        "#  .     #",
        "##########",
    ],
    [
        "##########",
        "#    #   #",
        "#  @     #",
        "#  $ #   #",
        "#    # . #",
        "##########",
    ]
];

let map = [];  // 전역 변수로 map과 targetMap 선언
let targetMap = [];

// 초기화 함수
function initializeStage() {
    map = stages[currentStage].map(row => row.split(''));
    targetMap = stages[currentStage].map(row => 
        row.split('').map(cell => (cell === '.' || cell === '#') ? cell : ' ')
    );

    console.log(map);
    console.log(targetMap);

    findPlayer();  // 플레이어 위치 찾기
    draw();  // 화면 그리기
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = map[row] ? map[row][col] : ' ';
            let targetTile = targetMap[row] ? targetMap[row][col] : ' ';
            
            // 먼저 타겟 맵을 그립니다 (테두리와 타겟 유지)
            if (targetTile === '#') {
                ctx.fillStyle = 'gray';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (targetTile === '.') {
                ctx.fillStyle = 'green';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }

            // 상자와 플레이어를 그립니다
            if (tile === '$') {
                // 상자가 타겟 위에 있을 경우 겹쳐서 그립니다
                if (targetTile === '.') {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                }
                ctx.fillStyle = 'brown';
                ctx.fillRect(col * tileSize + 5, row * tileSize + 5, tileSize - 10, tileSize - 10);
            } else if (tile === '@') {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function findPlayer() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (map[row][col] === '@') {
                player.x = col;
                player.y = row;
                return;  // 플레이어를 찾으면 함수 종료
            }
        }
    }
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    // 벽이 아닌 경우에만 이동 가능
    if (map[newY] && map[newY][newX] !== '#') {
        // 상자($)를 밀 수 있는지 확인
        if (map[newY][newX] === '$') {
            const nextX = newX + dx;
            const nextY = newY + dy;

            // 상자가 이동할 수 있는지 확인 (빈 공간이거나 타겟이면 가능)
            if (map[nextY] && (map[nextY][nextX] === ' ' || targetMap[nextY][nextX] === '.')) {
                map[nextY][nextX] = '$';
                map[newY][newX] = '@';
                map[player.y][player.x] = (targetMap[player.y][player.x] === '.' ? '.' : ' ');
                player.x = newX;
                player.y = newY;
            }
        } else {
            // 플레이어가 이동할 때, 타겟이면 타겟을 유지하고 빈 공간이면 지움
            map[player.y][player.x] = (targetMap[player.y][player.x] === '.' ? '.' : ' ');
            map[newY][newX] = '@';
            player.x = newX;
            player.y = newY;
        }
        draw();
        checkWin();
    }
}

function checkWin() {
    // 타겟 위치에 상자가 모두 있는지 확인
    let isClear = true;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (targetMap[row][col] === '.' && map[row][col] !== '$') {
                isClear = false;
            }
        }
    }
    // 클리어 시점을 draw 후에 처리
    if (isClear) {
        setTimeout(() => {
            alert("Stage Clear!");
            currentStage = (currentStage + 1) % stages.length;
            initializeStage(); // 스테이지 초기화
        }, 100); // 화면이 먼저 업데이트되도록 약간의 지연 추가
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        movePlayer(0, -1);
    } else if (event.key === 'ArrowDown') {
        movePlayer(0, 1);
    } else if (event.key === 'ArrowLeft') {
        movePlayer(-1, 0);
    } else if (event.key === 'ArrowRight') {
        movePlayer(1, 0);
    }
});

initializeStage(); // 게임 시작 시 스테이지 초기화
