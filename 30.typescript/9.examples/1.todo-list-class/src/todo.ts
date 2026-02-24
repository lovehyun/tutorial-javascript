// interface는 순수 타입(설계도)
// - 클래스는 그 설계도를 반드시 준수하도록 강제
// - 클래스가 실수로 빠뜨린 속성이나 타입을 TS가 잡아줌
// - 네이밍: ITodo 또는 TodoDTO (Data Transfer Object)
//     계층 간(Controller → Service → Repository 등) 또는
//     서버 ↔ 클라이언트 사이에서 데이터를 전송할 때 사용하는 순수 데이터 구조

// interface ITodo {
//     id: number;
//     title: string;
//     completed: boolean;
// }

// export class Todo implements ITodo {

// interface 없이 순수 class만 사용 
// - 이 Todo 클래스 자체가 타입이 됨
// - new Todo()로 인스턴스를 만들 수 있음
// - 타입 체크도 자동으로 됨
export class Todo {
    public id: number;
    public title: string;
    public completed: boolean;

    constructor(title: string) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }

    toggle(): void {
        this.completed = !this.completed;
    }
}
