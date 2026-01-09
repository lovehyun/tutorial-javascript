const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 공통 fetch 헬퍼: 실패(4xx/5xx)면 에러로 처리
// (옵셔널) signal 로 중단 처리
async function requestJson(url, { signal } = {}) {
    const res = await fetch(url, { signal });

    if (!res.ok) {
        // status 기반 에러 메시지 (statusText는 환경에 따라 비어있을 수 있음)
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }

    return res.json();
}

export function fetchUsers({ signal } = {}) {
    return requestJson(`${BASE_URL}/users`, { signal });
}

export function fetchUserById(userId, { signal } = {}) {
    return requestJson(`${BASE_URL}/users/${userId}`, { signal });
}

// (4단계 추가) 사용자 삭제
export async function deleteUserById(userId, { signal } = {}) {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        signal,
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }

    // JSONPlaceholder는 응답 바디가 거의 의미 없음
    return true;
}

// (5단계 추가) Posts 100개 목록
export async function fetchPosts({ signal } = {}) {
    const res = await fetch(`${BASE_URL}/posts`, { signal });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }
    return res.json();
}

// (6단계 추가) Post 상세
export async function fetchPostById(postId, { signal } = {}) {
    const res = await fetch(`${BASE_URL}/posts/${postId}`, { signal });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }
    return res.json();
}

// (6단계 추가) Post의 comments 목록
export async function fetchCommentsByPostId(postId, { signal } = {}) {
    const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, { signal });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    }
    return res.json();
}
