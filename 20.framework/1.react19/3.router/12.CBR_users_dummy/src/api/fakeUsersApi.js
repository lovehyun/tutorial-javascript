// 1000ms 기다렸다가 유저 목록을 돌려주는 "가짜 API"
const USERS = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
];

// fake API 지연 시간 (ms)
const FAKE_API_DELAY_MS = 500;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchUsers() {
    await sleep(FAKE_API_DELAY_MS);
    return USERS;
}

export async function fetchUserById(userId) {
    await sleep(FAKE_API_DELAY_MS);
    const user = USERS.find((u) => String(u.id) === String(userId)) || null;
    return user;
}
