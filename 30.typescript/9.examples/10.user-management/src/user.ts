// 사용자 데이터 포멧 정의
export interface User {
    id: number;
    name: string;
    email: string;
}

// 사용자 데이터 저장소 생성
export const users: User[] = [];

// 기본 내보내기
export default users;
