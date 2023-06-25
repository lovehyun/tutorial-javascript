// main.js

// ========================================================
// 외부모듈 로딩
// ========================================================

import { canvas_size, resizeCanvas  } from "./modules/common/canvas.js";
import { setSpaceship } from "./modules/common/gamedata.js";
import { Spaceship } from "./modules/resources/Spaceship.js";
import { setupKeyboardListener, setupTouchListener } from "./modules/common/gamecontrol.js";
import { fetchDataAndConnect } from "./modules/common/comm.js"
import { stage1 } from "./modules/stages/stage1.js";


// ========================================================
// 캔바스 화면 초기화
// ========================================================

// 초기화 및 리사이즈 이벤트 처리
function initialize() {
    // 윈도우 이벤트 등록
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const spaceshipStartPosition = {
        x: canvas_size.w / canvas_size.sf / 2 - 32,
        y: canvas_size.h / canvas_size.sf - 64,
    };

    // 게임 쉽 초기화
    const new_spaceship = Spaceship.getInstance(spaceshipStartPosition.x, spaceshipStartPosition.y);
    setSpaceship(new_spaceship);

    // 웹 소켓 셋업
    fetchDataAndConnect();
}


// ========================================================
// 메인 함수
// ========================================================
initialize();
setupKeyboardListener();
setupTouchListener();
stage1();
