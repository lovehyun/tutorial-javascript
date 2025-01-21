import { User, users } from './user';

export class UserController {
    // 사용자 추가
    static addUser(name: string, email: string): User {
        const newUser: User = { id: Date.now(), name, email };
        users.push(newUser);
        return newUser;
    }

    // 모든 사용자 조회
    static listUsers(): User[] {
        return users;
    }

    // 사용자 삭제
    static deleteUser(id: number): void {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            throw new Error(`User with ID ${id} not found.`);
        }
        users.splice(index, 1);
    }

    // 모든 사용자 삭제
    static clearUsers(): void {
        users.splice(0, users.length); // 배열 비우기
    }
}
