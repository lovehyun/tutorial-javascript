const BASE = 'https://jsonplaceholder.typicode.com';

async function httpGet(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export function fetchPosts() {
    return httpGet(`${BASE}/posts`);
}

export function fetchPost(postId) {
    return httpGet(`${BASE}/posts/${postId}`);
}

export function fetchPostComments(postId) {
    return httpGet(`${BASE}/posts/${postId}/comments`);
}
