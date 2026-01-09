const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 공통 fetch 헬퍼: 실패(4xx/5xx)면 에러로 처리
// (옵셔널) signal 로 중단 처리
async function requestJson(url, { signal } = {}) {
    const res = await fetch(url, { signal });

    if (!res.ok) {
        // status 기반 에러 메시지 (statusText는 환경에 따라 비어있을 수 있음)
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// 여기 둘다 Error 핸들러가 없어서 최종적으로는 caller 가 잡아주어야 함
export function fetchUsers({ signal } = {}) {
    return requestJson(`${BASE_URL}/users`, { signal });
}

export function fetchUserById(userId, { signal } = {}) {
    return requestJson(`${BASE_URL}/users/${userId}`, { signal });
}
