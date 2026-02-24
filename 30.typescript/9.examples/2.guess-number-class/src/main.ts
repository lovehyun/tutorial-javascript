// npm i -D @types/node

import { GameController } from './GameController';

const game = new GameController();
game.start();


// | 책임         | 클래스            | 장점                |
// | ---------- | -------------- | ----------------- |
// | 순수 숫자 처리   | GameLogic      | 테스트 가능, 독립성 높음    |
// | 입력 처리(I/O) | InputHandler   | 나중에 웹/GUI로 교체 쉬움  |
// | 게임 흐름 제어   | GameController | 비즈니스 로직이 깔끔하게 정리됨 |
