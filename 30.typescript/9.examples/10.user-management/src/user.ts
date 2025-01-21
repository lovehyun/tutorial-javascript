export interface User {
    id: number;
    name: string;
    email: string;
}

// 사용자 데이터 저장소 (임시 메모리)
export const users: User[] = [];
