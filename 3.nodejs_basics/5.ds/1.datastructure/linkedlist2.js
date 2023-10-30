class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.previous = null;
    }
}

class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    addToHead(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head.previous = newNode;
            this.head = newNode;
        }
    }

    addToTail(value) {
        const newNode = new Node(value);
        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.previous = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    printForward() {
        let current = this.head;
        while (current !== null) {
            console.log(current.value);
            current = current.next;
        }
    }

    printBackward() {
        let current = this.tail;
        while (current !== null) {
            console.log(current.value);
            current = current.previous;
        }
    }
}

// 더블 링크드 리스트 생성 및 테스트
const doublyList = new DoublyLinkedList();
doublyList.addToHead(3);
doublyList.addToHead(2);
doublyList.addToHead(1);

console.log("Forward:");
doublyList.printForward(); // 1, 2, 3 출력

console.log("Backward:");
doublyList.printBackward(); // 3, 2, 1 출력
