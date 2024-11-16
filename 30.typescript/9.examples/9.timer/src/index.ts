class Timer {
    private remainingTime: number;
    private intervalId: NodeJS.Timeout | null = null;

    constructor(seconds: number) {
        this.remainingTime = seconds;
    }

    start(): void {
        if (this.intervalId) {
            console.log('Timer is already running!');
            return;
        }

        console.log(`Starting timer with ${this.remainingTime} seconds.`); // 타이머 시작 로그

        this.intervalId = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime -= 1;
                console.log(`Time remaining: ${this.remainingTime} seconds`);
            } else {
                console.log('Time is up!');
                this.stop();
            }
        }, 1000);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;

            if (this.remainingTime > 0) {
                console.log(`Timer stopped with ${this.remainingTime} seconds remaining.`);
            } else {
                console.log('Timer stopped.');
            }
        } else {
            console.log('Timer is not running.');
        }
    }

    reset(seconds: number): void {
        this.stop();
        this.remainingTime = seconds;
        console.log(`Timer reset to ${seconds} seconds.`);
        // this.start(); // 리셋 후 자동 재시작
    }
}

const timer = new Timer(15);
timer.start(); // Starts the timer for 15 seconds
setTimeout(() => timer.stop(), 5000); // Stops the timer after 5 seconds

// 6초 후 타이머를 5초로 초기화하고 다시 시작
setTimeout(() => {
    timer.reset(5); // 타이머 초기화
    timer.start();   // 초기화 후 다시 시작
}, 6000);
