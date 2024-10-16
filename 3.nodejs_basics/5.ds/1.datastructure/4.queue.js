// 큐(Queue) - 배열과 기본 함수를 사용한 동작
const queue = [];
queue.push(1); // 요소 추가
queue.push(2);
queue.push(3);
console.log(queue.shift()); // 1 (FIFO 순서로 삭제)


// 직접 구현
class Queue {
    constructor() {
        this.queue = {}; // 큐를 저장할 객체
        this.head = 0; // 큐의 시작 인덱스
        this.tail = 0; // 큐의 끝 인덱스
    }

    // 큐에 요소 추가
    enqueue(element) {
        this.queue[this.tail] = element;
        this.tail++;
    }

    // 큐에서 요소 제거
    dequeue() {
        if (this.tail === this.head) return undefined;

        const result = this.queue[this.head];
        delete this.queue[this.head];
        this.head++;
        return result;
    }

    // 큐의 길이 확인
    size() {
        return this.tail - this.head;
    }

    // 큐가 비어있는지 확인
    isEmpty() {
        return this.tail === this.head;
    }

    // 큐의 첫 요소 확인
    peek() {
        return this.queue[this.head];
    }
}

// 큐 사용 예시
const myQueue = new Queue();

myQueue.enqueue(1);
myQueue.enqueue(2);
myQueue.enqueue(3);

console.log(myQueue.peek()); // 1 (첫 번째 요소)
console.log(myQueue.size()); // 3 (큐의 길이)

myQueue.dequeue();
console.log(myQueue.peek()); // 2 (요소 제거 후)
