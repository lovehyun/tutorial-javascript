// 스택(Stack) - 배열을 사용한 기본 빌트인 자료구조와 함수
const stack = [];
stack.push(1); // 요소 추가
stack.push(2);
stack.push(3);
console.log(stack.pop()); // 3 (LIFO 순서로 삭제)


// 직접 구현
class Stack {
    constructor() {
        this.stack = {}; // 스택을 저장할 객체
        this.count = 0; // 스택의 길이
    }

    // 스택에 요소 추가
    push(element) {
        this.stack[this.count] = element;
        this.count++;
    }

    // 스택에서 요소 제거
    pop() {
        if (this.count === 0) return undefined;

        this.count--;
        const result = this.stack[this.count];
        delete this.stack[this.count];
        return result;
    }

    // 스택의 가장 위 요소 확인
    peek() {
        return this.stack[this.count - 1];
    }

    // 스택의 길이 확인
    size() {
        return this.count;
    }

    // 스택이 비어있는지 확인
    isEmpty() {
        return this.count === 0;
    }
}

// 스택 사용 예시
const myStack = new Stack();

myStack.push(1);
myStack.push(2);
myStack.push(3);

console.log(myStack.peek()); // 3 (가장 위의 요소)
console.log(myStack.size()); // 3 (스택의 길이)

myStack.pop();
console.log(myStack.peek()); // 2 (최신 요소 제거 후)
