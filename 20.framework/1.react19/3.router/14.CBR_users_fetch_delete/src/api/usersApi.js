const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 공통 fetch 헬퍼: 실패(4xx/5xx)면 에러로 처리
async function requestJson(url, { signal } = {}) {
    const res = await fetch(url, { signal });

    if (!res.ok) {
        // BR에서 쓰던 방식 그대로 유지 (statusText는 환경에 따라 비어있을 수 있음)
        throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());

        // err = {
        //     name: 'Error',
        //     message: 'HTTP 404',
        //     stack: 'Error: HTTP 404\n  at ...'
        // }
        // 위 에러 HTTP 404 는 err.message 에 저장 됨.
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
