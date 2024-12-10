// ------------------------------------------------------------------
// Creating a Snake Game Tutorial with HTML5
// License: GPLv3
// Original Author: http://rembound.com/articles/creating-a-snake-game-tutorial-with-html5
// Changed by shpark: https://github.com/lovehyun/tutorial-javascript/tree/main/10.projects/2.canvas_games/1.snake2_img
// ------------------------------------------------------------------

// 스크립트 시작
window.onload = () => {
    const game = init();

    // 메인 루프 시작
    game.main(0);
};

// 초기화 함수
function init() {
    const canvas = document.getElementById("snakeCanvas");
    const context = canvas.getContext("2d");
    
    // 게임 객체 생성
    const snake = new Snake();
    const board = new Board(columns=20, rows=15, tilewidth=32, tileheight=32);
    const renderer = new Renderer(context, canvas);

    // 캔버스 크기를 보드 크기에 맞춤
    canvas.width = board.columns * board.tilewidth;
    canvas.height = board.rows * board.tileheight;

    // Game 객체에 필요한 요소들을 주입하고 반환
    const game = new Game(snake, board, renderer);

    // 마우스 및 키보드 이벤트 추가
    canvas.addEventListener("mousedown", () => {
        game.handleInput('click');
    });
    document.addEventListener("keydown", (e) => {
        game.handleInput(e.key);
    });

    return game;
}

// 뱀 클래스
class Snake {
    // 이동 방향 상수
    static DIRECTIONS = {
        UP:    [0, -1], /* 이동할 (x, y) 축 */
        RIGHT: [1,  0],
        DOWN:  [0,  1],
        LEFT:  [-1, 0],
    };

    static DIRECTION_ORDER = [Snake.DIRECTIONS.UP, Snake.DIRECTIONS.RIGHT, Snake.DIRECTIONS.DOWN, Snake.DIRECTIONS.LEFT];

    static KEYS = {
        LEFT:  ["ArrowLeft",  "a", "A"],
        UP:    ["ArrowUp",    "w", "W"],
        RIGHT: ["ArrowRight", "d", "D"],
        DOWN:  ["ArrowDown",  "s", "S"],
        GROW:  [" "],
    };

    constructor() {
        this.init(0, 0, Snake.DIRECTIONS.RIGHT, 10, 1);
    }

    init(x, y, direction, speed, numsegments) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.movedelay = 0;
        this.growsegments = 0;
        this.segments = Array.from({ length: numsegments }, (_, i) => ({
            x: x - i * direction[0], // 방향에 맞춰 x값 변경
            y: y - i * direction[1], // 방향에 맞춰 y값 변경
        }));
    }

    grow() {
        this.growsegments++;
    }

    tryMove(dt) {
        this.movedelay += dt; // 프레임 간의 시간 누적
        return this.movedelay > 1 / this.speed; // 누적된 시간이 일정 시간(1/speed)을 초과하면 true 반환
    }

    nextMove() {
        return {
            x: this.x + this.direction[0], // 현재 방향에 따른 x 이동 계산
            y: this.y + this.direction[1], // 현재 방향에 따른 y 이동 계산
        };
    }

    move() {
        const nextmove = this.nextMove();
        this.x = nextmove.x;
        this.y = nextmove.y;

        const lastseg = this.segments[this.segments.length - 1];
        const growx = lastseg.x;
        const growy = lastseg.y;

        for (let i = this.segments.length - 1; i >= 1; i--) {
            this.segments[i].x = this.segments[i - 1].x;
            this.segments[i].y = this.segments[i - 1].y;
        }

        if (this.growsegments > 0) {
            this.segments.push({ x: growx, y: growy });
            this.growsegments--;
        }

        this.segments[0].x = this.x;
        this.segments[0].y = this.y;
        this.movedelay = 0;
    }

    // 뱀이 자신의 몸에 부딛친경우
    hasCollision(nx, ny) {
        return this.segments.some(segment => segment.x === nx && segment.y === ny);
    }

    draw(renderer, tilewidth, tileheight) {
        this.segments.forEach((segment, i) => {
            const tilex = segment.x * tilewidth;
            const tiley = segment.y * tileheight;

            let tx, ty;

            if (i === 0) {
                // 머리 부분
                const nseg = this.segments[i + 1]; // 다음 세그먼트를 기반으로 머리 방향 결정
                ({ tx, ty } = this.getHeadTile(segment, nseg));
            } else if (i === this.segments.length - 1) {
                // 꼬리 부분
                const pseg = this.segments[i - 1]; // 이전 세그먼트를 기반으로 꼬리 방향 결정
                ({ tx, ty } = this.getTailTile(segment, pseg));
            } else {
                // 몸통 부분
                const pseg = this.segments[i - 1]; // 이전과 이후 세그먼트를 기반으로 몸의 방향 결정
                const nseg = this.segments[i + 1];
                ({ tx, ty } = this.getBodyTile(segment, pseg, nseg));
            }
    
            renderer.drawTile(tx, ty, tilex, tiley, tilewidth, tileheight);
        });
    }

    // 머리 부분 타일 결정 함수
    getHeadTile(segment, nseg) {
        if (segment.x > nseg.x) return Renderer.SNAKE_TILES.head.right;
        if (segment.y < nseg.y) return Renderer.SNAKE_TILES.head.up;
        if (segment.y > nseg.y) return Renderer.SNAKE_TILES.head.down;
        return Renderer.SNAKE_TILES.head.left;
    }

    // 꼬리 부분 타일 결정 함수
    getTailTile(segment, pseg) {
        if (pseg.x > segment.x) return Renderer.SNAKE_TILES.tail.right;
        if (pseg.y < segment.y) return Renderer.SNAKE_TILES.tail.up;
        if (pseg.y > segment.y) return Renderer.SNAKE_TILES.tail.down;
        return Renderer.SNAKE_TILES.tail.left;
    }

    // 몸통 부분 타일 결정 함수
    getBodyTile(segment, pseg, nseg) { // 정방향 역방향 모두 고려
        if ((pseg.x > segment.x && nseg.x < segment.x) || 
            (pseg.x < segment.x && nseg.x > segment.x)) { 
            return Renderer.SNAKE_TILES.body.horizontal;
        }
        if ((pseg.y < segment.y && nseg.y > segment.y) || 
            (pseg.y > segment.y && nseg.y < segment.y)) {
            return Renderer.SNAKE_TILES.body.vertical;
        }
        if ((pseg.y > segment.y && nseg.x < segment.x) || 
            (pseg.x < segment.x && nseg.y > segment.y)) {
            return Renderer.SNAKE_TILES.body.curveLeftDown;
        }
        if ((pseg.y < segment.y && nseg.x < segment.x) || 
            (pseg.x < segment.x && nseg.y < segment.y)) {
            return Renderer.SNAKE_TILES.body.curveLeftUp;
        }
        if ((pseg.x > segment.x && nseg.y < segment.y) || 
            (pseg.y < segment.y && nseg.x > segment.x)) {
            return Renderer.SNAKE_TILES.body.curveRightUp;
        }
        return Renderer.SNAKE_TILES.body.curveRightDown;
    }

    // 방향 변경 함수
    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    changeDirectionClockwise() {
        // 현재 방향의 인덱스를 구한 뒤 다음 방향으로 전환
        const currentIndex = Snake.DIRECTION_ORDER.indexOf(this.direction);
        const nextIndex = (currentIndex + 1) % Snake.DIRECTION_ORDER.length;
        this.direction = Snake.DIRECTION_ORDER[nextIndex];
    }

    handleKeyboardInput(key) {
        if (Snake.KEYS.LEFT.includes(key)) {
            if (this.direction !== Snake.DIRECTIONS.RIGHT) { 
                this.changeDirection(Snake.DIRECTIONS.LEFT);
            }
        } else if (Snake.KEYS.UP.includes(key)) {
            if (this.direction !== Snake.DIRECTIONS.DOWN) {
                this.changeDirection(Snake.DIRECTIONS.UP);
            }
        } else if (Snake.KEYS.RIGHT.includes(key)) {
            if (this.direction !== Snake.DIRECTIONS.LEFT) {
                this.changeDirection(Snake.DIRECTIONS.RIGHT);
            }
        } else if (Snake.KEYS.DOWN.includes(key)) {
            if (this.direction !== Snake.DIRECTIONS.UP) {
                this.changeDirection(Snake.DIRECTIONS.DOWN);
            }
        } else if (Snake.KEYS.GROW.includes(key)) {
            this.grow();
        }
    }
}

// 보드 클래스
class Board {
    static BOARD_EMPTY = 0;
    static BOARD_WALL = 1;
    static BOARD_APPLE = 2;

    constructor(columns, rows, tilewidth, tileheight) {
        this.columns = columns;
        this.rows = rows;
        this.tilewidth = tilewidth;
        this.tileheight = tileheight;

        this.tiles = Array.from({ length: this.columns }, () => Array(this.rows).fill(Board.BOARD_EMPTY));
    }

    // 기본 보드 생성
    generate() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (i === 0 || i === this.columns - 1 || j === 0 || j === this.rows - 1) {
                    this.tiles[i][j] = Board.BOARD_WALL; // 가장자리에 벽 추가
                } else {
                    this.tiles[i][j] = Board.BOARD_EMPTY; // 빈 공간
                }
            }
        }
    }

    draw(renderer) {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                const tile = this.tiles[i][j];
                const tilex = i * this.tilewidth;
                const tiley = j * this.tileheight;

                if (tile === Board.BOARD_EMPTY) { // 빈공간
                    renderer.context.fillStyle = "#f7e697";
                    renderer.context.fillRect(tilex, tiley, this.tilewidth, this.tileheight);
                } else if (tile === Board.BOARD_WALL) { // 벽
                    renderer.context.fillStyle = "#bcae76";
                    renderer.context.fillRect(tilex, tiley, this.tilewidth, this.tileheight);
                } else if (tile === Board.BOARD_APPLE) { // 사과
                    renderer.context.fillStyle = "#f7e697";
                    renderer.context.fillRect(tilex, tiley, this.tilewidth, this.tileheight);
                    
                    let {tx, ty} = Renderer.SNAKE_TILES.food.apple;
                    renderer.drawTile(tx, ty, tilex, tiley, this.tilewidth, this.tileheight); // Use drawTile from Renderer
                }
            }
        }
    }

    // 사과 추가
    addApple(snake) {
        // 랜덤 정수 반환 함수
        const randRange = (low, high) => Math.floor(low + Math.random() * (high - low + 1));

        let valid = false;
        while (!valid) {
            const ax = randRange(0, this.columns - 1);
            const ay = randRange(0, this.rows - 1);

            let overlap = snake.segments.some(segment => segment.x === ax && segment.y === ay);

            if (!overlap && this.tiles[ax][ay] === Board.BOARD_EMPTY) {
                this.tiles[ax][ay] = Board.BOARD_APPLE;
                valid = true;
            }
        }
    }

    isWall(x, y) {
        return this.tiles[x][y] === Board.BOARD_WALL;
    }

    isApple(x, y) {
        return this.tiles[x][y] === Board.BOARD_APPLE;
    }

    removeApple(x, y) {
        this.tiles[x][y] = Board.BOARD_EMPTY;
    }

}

// 화면에 그림 그리는 클래스
class Renderer {
    // 스프라이트 시트의 타일 정보 정의
    static SNAKE_TILE_IMAGE = "snake-graphics.png";
    static SNAKE_TILE_SIZE = 64;
    static SNAKE_TILES = {
        head: {
            up:    { tx: 3, ty: 0 },
            right: { tx: 4, ty: 0 },
            down:  { tx: 4, ty: 1 },
            left:  { tx: 3, ty: 1 },
        },
        tail: {
            up:    { tx: 3, ty: 2 },
            right: { tx: 4, ty: 2 },
            down:  { tx: 4, ty: 3 },
            left:  { tx: 3, ty: 3 },
        },
        body: {
            horizontal:     { tx: 1, ty: 0 },
            vertical:       { tx: 2, ty: 1 },
            curveLeftDown:  { tx: 2, ty: 0 },
            curveLeftUp:    { tx: 2, ty: 2 },
            curveRightUp:   { tx: 0, ty: 1 },
            curveRightDown: { tx: 0, ty: 0 },
        },
        food: {
            apple: { tx: 0, ty: 3 },
        }
    };

    constructor(context, canvas) {
        this.context = context;
        this.canvas = canvas;

        this.fpstime = 0;
        this.framecount = 0;
        this.fps = 0;
        this.lastframe = 0;

        // 이미지 로드 및 로딩 완료 여부
        this.tileimage = new Image();
        this.tileimage.src = Renderer.SNAKE_TILE_IMAGE;
        this.isImageLoaded = false;
        this.tileimage.onload = () => {
            this.isImageLoaded = true;
            console.log("Image loaded successfully");
        };
    }

    calculateDeltaTime(tframe) {
        const dt = (tframe - this.lastframe) / 1000;
        this.lastframe = tframe;  // 마지막 프레임 시간 갱신
        this.updateFps(dt);       // 프레임 수 갱신
        return dt;
    }

    // FPS 계산 및 업데이트
    updateFps(dt) {
        this.fpstime += dt;
        this.framecount++;

        // 0.25초마다 FPS 갱신
        if (this.fpstime > 0.25) {
            this.fps = Math.round(this.framecount / this.fpstime);
            this.fpstime = 0;
            this.framecount = 0;
        }
    }

    render(board, snake, score, gameover) {
        this.context.fillStyle = "#577ddb";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isImageLoaded) { // 이미지 로딩 완료 후 게임 그리기
            board.draw(this);
            snake.draw(this, board.tilewidth, board.tileheight);
        }

        this.renderScoreAndFPS(score);

        if (gameover) {
            this.displayGameover();
        }
    }

    renderScoreAndFPS(score) {
        this.context.fillStyle = "#ffffff";
        this.context.font = "18px Verdana";
        this.context.fillText("Score: " + score, 30, 30);
        this.context.fillText("FPS: " + this.fps, this.canvas.width - 100, 30);
    }

    drawTile(tx, ty, tilex, tiley, tilewidth, tileheight) {
        this.context.drawImage(
            this.tileimage, 
            tx * Renderer.SNAKE_TILE_SIZE, // sx, 잘라낼 영역의 x좌표
            ty * Renderer.SNAKE_TILE_SIZE, // sy, 잘라낼 영역의 y좌표
            Renderer.SNAKE_TILE_SIZE,      // sWidth, 잘라낼 이미지 width
            Renderer.SNAKE_TILE_SIZE,      // sHeight, 잘라낼 이미지 height
            tilex,                         // dx, 목표 x좌표
            tiley,                         // dy, 목표 y좌표
            tilewidth,                     // dWidth, 캔버스에 그릴 때의 width
            tileheight                     // dHeight, 캔버스에 그릴 때의 height
        );
    }

    displayGameover() {
        // 중앙 텍스트를 그리는 함수
        const drawCenterText = (text, x, y, width) => {
            const textdim = this.context.measureText(text);
            this.context.fillText(text, x + (width - textdim.width) / 2, y);
        };

        this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = "#ffffff";
        this.context.font = "24px Verdana";
        drawCenterText("Press 'y' key to start!", 0, this.canvas.height / 2, this.canvas.width);
    }
}

// 게임 로직 처리
class Game {
    static SCORE_INCREMENT = 10;

    constructor(snake, board, renderer) {
        this.snake = snake;
        this.board = board;
        this.renderer = renderer;
        this.score = 0;
        this.gameover = false;
        this.gameovertime = 1;

        this.startNewGame();
    }

    startNewGame() {
        this.snake.init(10, 10, Snake.DIRECTIONS.RIGHT, 10, 3);
        this.board.generate();
        this.board.addApple(this.snake);
        this.score = 0;
        this.gameover = false;
    }
    
    // 새로운 게임 시작 시도
    tryNewGame() {
        if (this.gameovertime > 1) { /* 키보드 눌려서 바로 시작되지 않도록 살짝 딜레이 */
            this.startNewGame();
        }
    }

    // 게임 상태 업데이트
    update(dt) {
        if (!this.gameover) {
            this.updateGame(dt);
        } else {
            this.gameovertime += dt;
        }
    }

    updateGame(dt) {
        // 뱀의 다음 이동을 계산
        if (this.snake.tryMove(dt)) {
            const nextMove = this.snake.nextMove();
            const nx = nextMove.x;
            const ny = nextMove.y;

            // 벽에 부딪히거나 뱀의 몸에 충돌하는지 검사
            if (this.isCollision(nx, ny)) {
                this.gameover = true;
                return;
            }
            
            // 사과를 먹었는지 확인
            if (this.board.isApple(nx, ny)) {
                this.snake.grow();
                this.board.removeApple(nx, ny);
                this.board.addApple(this.snake);
                this.score += Game.SCORE_INCREMENT;
            }

            this.snake.move();
        }
    }

    isCollision(nx, ny) {
        // 보드의 경계 밖이거나 뱀의 몸에 충돌하는 경우
        return this.board.isWall(nx, ny) || this.snake.hasCollision(nx, ny);
    }

    // 메인 루프
    main = (tframe) => {
        window.requestAnimationFrame(this.main);
        const dt = this.renderer.calculateDeltaTime(tframe);
        this.update(dt);
        this.renderer.render(this.board, this.snake, this.score, this.gameover);
    }

    handleInput(input) {
        if (this.gameover) {
            // gameover 상태에서는 'y' 또는 'Y' 키만 입력받아 새로운 게임 시작
            if (input.toLowerCase() === 'y') {
                this.tryNewGame();
            }
        } else if (input === 'click') {
            this.snake.changeDirectionClockwise();
        } else {
            this.snake.handleKeyboardInput(input);
        }
    }
}
