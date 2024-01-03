// 캔버스와 2D 그래픽 컨텍스트 가져오기
const canvas = document.getElementById('pangCanvas');
const ctx = canvas.getContext('2d');

// 공의 반지름 설정
const ballRadius = 50;

// 초기 위치 설정
let ballX = canvas.width / 2;
let ballY = canvas.height * 0.2;

// 초기 속도 설정
let ballDx = 2;
let ballDy = -2;

// 중력 설정
const gravity = 0.1;

// 캐릭터 설정
const characterWidth = 20;
const characterHeight = 40;
let characterX = canvas.width / 2 - characterWidth / 2;
let characterY = canvas.height - characterHeight; // 초기 캐릭터 Y 위치
let characterDx = 5;

// 로프 설정
let ropeLength = 0;
let ropeX; // 로프의 x 좌표
const ropeSpeed = 5; // 로프 올리는 속도
const maxRopeLength = canvas.height; // 최대 로프 길이
let isRopeDrawing = false; // 로프가 그려지고 있는지 여부

// 키 상태 저장
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
};

// 스페이스 키 상태 저장
let isSpacePressed = false;

// 공 그리기 함수
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// 캐릭터 그리기 함수
function drawCharacter() {
    ctx.beginPath();
    ctx.rect(characterX, characterY, characterWidth, characterHeight);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.closePath();
}

// 로프 그리기 함수
function drawRope() {
    const ropeY = characterY - ropeLength;

    ctx.beginPath();
    ctx.moveTo(ropeX, characterY);
    ctx.lineTo(ropeX, ropeY);
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.closePath();
}

// 로프 그리기 함수 - 굵기
function drawRope2() {
    const ropeY = characterY - ropeLength;
    const ropeThickness = 5; // 로프의 굵기 조절

    ctx.beginPath();
    ctx.moveTo(ropeX - ropeThickness / 2, characterY); // 로프 시작점
    ctx.lineTo(ropeX - ropeThickness / 2, ropeY); // 로프 끝점
    ctx.lineTo(ropeX + ropeThickness / 2, ropeY); // 로프 끝점
    ctx.lineTo(ropeX + ropeThickness / 2, characterY); // 로프 시작점
    ctx.closePath();

    ctx.fillStyle  = '#000';
    ctx.fill();
}

// 로프 그리기 함수 - 곡선
function drawRope3() {
    const ropeY = characterY - ropeLength;
    const controlPointOffsetX = 10; // 제어점의 X 오프셋 조절
    const controlPointOffsetY = 20; // 제어점의 Y 오프셋 조절
    const curveCount = Math.floor(ropeLength / 20) + 1; // 현재 높이에 따른 커브 수 계산

    ctx.beginPath();
    ctx.moveTo(ropeX, characterY);

    for (let i = 1; i <= curveCount; i++) {
        // 현재 커브에 해당하는 제어점 계산
        const offsetX = controlPointOffsetX * (i % 2 === 0 ? 1 : -1);
        const offsetY = controlPointOffsetY * (i % 2 === 0 ? 1 : -1);

        // 커브 그리기
        ctx.quadraticCurveTo(ropeX + offsetX, ropeY - (i * 20) + offsetY, ropeX, ropeY - (i * 20));
    }

    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.closePath();
}

// 화면 갱신 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawCharacter();

    // 중력 적용
    ballDy += gravity;

    // 공 위치 업데이트
    ballX += ballDx;
    ballY += ballDy;

    // 벽에 부딪혔을 때 튕기기
    if (ballX + ballDx > canvas.width - ballRadius || ballX + ballDx < ballRadius) {
        ballDx = -ballDx;
    }

    // 바닥에 닿았을 때 튕기기
    if (ballY + ballDy > canvas.height - ballRadius) {
        ballY = canvas.height - ballRadius;
        ballDy = -ballDy;
    } else if (ballY + ballDy < ballRadius) {
        ballDy = -ballDy;
    }

    // 캐릭터 위치 업데이트
    if (keys.ArrowRight && characterX + characterWidth < canvas.width) {
        characterX += characterDx;
    }

    if (keys.ArrowLeft && characterX > 0) {
        characterX -= characterDx;
    }

    // 로프 그리기 및 로프 상태 업데이트
    if (isRopeDrawing) {
        drawRope3();
        ropeLength += ropeSpeed;

        // 로프가 화면 맨 위에 닿으면 로프 초기화
        if (characterY - ropeLength <= 0) {
            isRopeDrawing = false;
            ropeLength = 0;
            isSpacePressed = false; // 로프가 초기화되면 스페이스 키 상태도 초기화
        }
    }
}

// 애니메이션 프레임 요청을 이용한 화면 갱신 함수
function update() {
    draw();
    requestAnimationFrame(update);
}

// 키 다운 이벤트 리스너 등록
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;

    if (event.key === ' ' && !isSpacePressed) {
        isSpacePressed = true;
        ropeX = characterX + characterWidth / 2; // 로프의 x 좌표 설정
        isRopeDrawing = true;
    }
});

// 키 업 이벤트 리스너 등록
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// 초기 화면 갱신 시작
update();
