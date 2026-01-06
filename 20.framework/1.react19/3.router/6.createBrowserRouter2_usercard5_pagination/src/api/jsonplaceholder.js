const BASE = 'https://jsonplaceholder.typicode.com';

async function httpGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ✅ 페이지네이션용 (헤더에서 전체 개수 읽기)
export async function fetchPostsPage(page, limit) {
    const res = await fetch(`${BASE}/posts?_page=${page}&_limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const items = await res.json();
    const total = Number(res.headers.get('x-total-count') || 0);

    return { items, total };
}

// (기존 것들)
export function fetchPost(postId) {
    return httpGet(`${BASE}/posts/${postId}`);
}

export function fetchPostComments(postId) {
    return httpGet(`${BASE}/posts/${postId}/comments`);
}
