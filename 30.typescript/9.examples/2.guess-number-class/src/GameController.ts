// GameController.ts
import { GameLogic } from './GameLogic';
import { InputHandler } from './InputHandler';

export class GameController {
    private attempts = 0;

    constructor(
        private readonly logic = new GameLogic(),
        private readonly input = new InputHandler(),
        private readonly maxAttempts = 7
    ) {}

    async start() {
        console.log('🎯 숫자 맞추기 게임 시작!');
        // console.log('DEBUG target:', this.logic.getTarget());

        while (this.attempts < this.maxAttempts) {
            this.attempts++;
            const answer = await this.input.ask(`(${this.attempts}/${this.maxAttempts}) 숫자를 입력하세요: `);

            const guess = Number(answer);
            if (isNaN(guess)) {
                console.log('❌ 숫자만 입력하세요!');
                this.attempts--; // 잘못 입력은 횟수 무시
                continue;
            }

            const result = this.logic.check(guess);
            console.log(result);

            if (result === 'Correct!') {
                console.log('🎉 정답입니다!');
                this.input.close();
                return;
            }
        }

        console.log(`❌ 실패! 정답은 ${this.logic.getTarget()}였습니다.`);
        this.input.close();
    }
}

