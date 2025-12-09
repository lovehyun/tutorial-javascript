// ==== Stack 구현 (질문 주신 코드 그대로) ====
class Stack {
    constructor() {
        this.stack = {};
        this.count = 0;
    }

    push(element) {
        this.stack[this.count] = element;
        this.count++;
    }

    pop() {
        if (this.count === 0) return undefined;
        this.count--;
        const result = this.stack[this.count];
        delete this.stack[this.count];
        return result;
    }

    peek() {
        return this.stack[this.count - 1];
    }

    size() {
        return this.count;
    }

    isEmpty() {
        return this.count === 0;
    }

    // 디버깅용: 현재 스택 상태를 배열로 보여주기 (아래쪽이 앞)
    toArray() {
        const result = [];
        for (let i = 0; i < this.count; i++) {
            result.push(this.stack[i]);
        }
        return result;
    }
}

// ==== 하노이 탑 구현 ====

// 기둥 3개 생성
const tower1 = new Stack(); // 시작 기둥
const tower2 = new Stack(); // 보조 기둥
const tower3 = new Stack(); // 목표 기둥

// 디스크 개수
const N = 5;

// 1번 기둥에 5,4,3,2,1 쌓기 (5가 맨 아래, 1이 맨 위)
for (let disk = N; disk >= 1; disk--) {
    tower1.push(disk);
}

// 디스크 이동 함수 (규칙 검사 + 로그 출력)
function moveDisk(from, to, fromName, toName) {
    const disk = from.pop();
    if (disk === undefined) {
        throw new Error(`기둥 ${fromName}에서 뺄 디스크가 없습니다.`);
    }

    // 규칙 위반 체크: to의 맨 위가 더 작으면 안 됨
    if (!to.isEmpty() && to.peek() < disk) {
        throw new Error(`규칙 위반! 큰 디스크(${disk})를 작은 디스크(${to.peek()}) 위에 올릴 수 없습니다.`);
    }

    to.push(disk);
    console.log(`디스크 ${disk} : ${fromName} → ${toName}`);
}

// 재귀 하노이 함수
function hanoi(n, from, aux, to, fromName, auxName, toName) {
    if (n === 0) return;

    // 1. 위에 있는 n-1개를 보조 기둥으로 옮기기
    hanoi(n - 1, from, to, aux, fromName, toName, auxName);

    // 2. 가장 큰 디스크 1개를 목표 기둥으로 옮기기
    moveDisk(from, to, fromName, toName);

    // 3. 보조 기둥 위의 n-1개를 목표 기둥으로 옮기기
    hanoi(n - 1, aux, from, to, auxName, fromName, toName);
}

// 실행 전 상태 출력
console.log('초기 상태:');
console.log('1번 기둥:', tower1.toArray());
console.log('2번 기둥:', tower2.toArray());
console.log('3번 기둥:', tower3.toArray());
console.log('========================');

// 하노이 탑 실행: 1번 → 3번 (2번은 보조)
hanoi(N, tower1, tower2, tower3, '1번', '2번', '3번');

console.log('========================');
console.log('최종 상태:');
console.log('1번 기둥:', tower1.toArray());
console.log('2번 기둥:', tower2.toArray());
console.log('3번 기둥:', tower3.toArray()); // [5,4,3,2,1] 순서로 쌓여 있어야 함
