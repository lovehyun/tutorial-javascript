// src/handlers/users.handlers.js
import { BASE_URL, fetchUsers, fetchUserById } from '../api/usersApi.js';
import { redirect } from 'react-router-dom';

// Users 목록 loader
export function usersLoader({ request }) {
    return fetchUsers({ signal: request.signal });
}

// User 상세 loader
export async function userDetailLoader({ params, request }) {
    const user = await fetchUserById(params.userId, { signal: request.signal });

    // (방어) 케이스에 따라 {} 같은 값이 올 수 있다는 가정 방어
    // 보통은 fetchUserById에서 !res.ok면 throw라 여기까지 잘 안 옵니다.
    if (!user || !user.id) {
        throw new Response('User Not Found', { status: 404 });
    }

    return user;
}

// User 삭제 action (화면 없음)
export async function deleteUserAction({ params, request }) {
    const res = await fetch(`${BASE_URL}/users/${params.userId}`, {
        method: 'DELETE',
        signal: request.signal, // 라우터가 주는 signal로 취소 지원
    });

    if (!res.ok) {
        // statusText는 환경에 따라 비어있을 수 있음
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }

    // 삭제 후 목록으로 이동
    return redirect('/users');
}
