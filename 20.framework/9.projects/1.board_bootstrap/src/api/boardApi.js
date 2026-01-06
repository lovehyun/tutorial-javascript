// LocalStorage 기반 "가짜 서버"

const KEY = 'board_posts_v1';

function sleep(ms = 150) {
    return new Promise((r) => setTimeout(r, ms));
}

function readAll() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeAll(posts) {
    localStorage.setItem(KEY, JSON.stringify(posts));
}

function seedIfEmpty() {
    const posts = readAll();
    if (posts.length > 0) return;

    const now = Date.now();
    const seeded = Array.from({ length: 27 }).map((_, i) => ({
        id: String(now + i),
        title: `샘플 글 ${i + 1}`,
        author: '관리자',
        content: `이것은 샘플 본문입니다.\nReact 게시판 실습용 데이터입니다.\n(번호: ${i + 1})`,
        createdAt: new Date(now - i * 3600_000).toISOString(),
        updatedAt: null,
    }));
    writeAll(seeded);
}

export async function listPosts({ page = 1, pageSize = 9, q = '' }) {
    seedIfEmpty();
    await sleep();

    const all = readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const keyword = q.trim().toLowerCase();

    const filtered = keyword
        ? all.filter(
              (p) =>
                  p.title.toLowerCase().includes(keyword) ||
                  p.author.toLowerCase().includes(keyword) ||
                  p.content.toLowerCase().includes(keyword)
          )
        : all;

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const start = (safePage - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, totalPages, page: safePage, pageSize, q };
}

export async function getPost(id) {
    seedIfEmpty();
    await sleep();
    const post = readAll().find((p) => String(p.id) === String(id));
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    return post;
}

export async function createPost({ title, author, content }) {
    await sleep();
    const posts = readAll();
    const now = new Date().toISOString();

    const newPost = {
        id: String(Date.now()),
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        createdAt: now,
        updatedAt: null,
    };

    writeAll([newPost, ...posts]);
    return newPost;
}

export async function updatePost(id, { title, author, content }) {
    await sleep();
    const posts = readAll();
    const idx = posts.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) throw new Error('게시글을 찾을 수 없습니다.');

    const updated = {
        ...posts[idx],
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
    };

    posts[idx] = updated;
    writeAll(posts);
    return updated;
}

export async function deletePost(id) {
    await sleep();
    const posts = readAll().filter((p) => String(p.id) !== String(id));
    writeAll(posts);
    return { ok: true };
}
