class Counter {
    private value: number;

    constructor(initialValue: number = 0) {
        this.value = initialValue;
    }

    increment(): void {
        this.value += 1;
        console.log(`Counter: ${this.value}`);
    }

    decrement(): void {
        this.value -= 1;
        console.log(`Counter: ${this.value}`);
    }

    reset(): void {
        this.value = 0;
        console.log(`Counter reset. Current value: ${this.value}`);
    }
}

const counter = new Counter();
counter.increment(); // Counter: 1
counter.increment(); // Counter: 2
counter.decrement(); // Counter: 1
counter.reset(); // Counter reset. Current value: 0
