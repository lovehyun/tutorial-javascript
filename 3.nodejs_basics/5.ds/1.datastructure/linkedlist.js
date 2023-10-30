class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    addToHead(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    printList() {
        let current = this.head;
        while (current !== null) {
            console.log(current.value);
            current = current.next;
        }
    }
}

const linkedList = new LinkedList();
linkedList.addToHead(3);
linkedList.addToHead(2);
linkedList.addToHead(1);
linkedList.printList(); // 1, 2, 3 출력
