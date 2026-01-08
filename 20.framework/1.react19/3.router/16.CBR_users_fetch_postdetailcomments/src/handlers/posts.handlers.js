// src/handlers/posts.handlers.js
import { fetchPosts, fetchPostById, fetchCommentsByPostId } from '../api/usersApi.js';

// Posts 목록 loader(100개)
export function postsLoader({ request }) {
    return fetchPosts({ signal: request.signal });
}

// Post 상세 + comments loader
export async function postDetailLoader({ params, request }) {
    const { postId } = params;

    const [post, comments] = await Promise.all([
        fetchPostById(postId, { signal: request.signal }),
        fetchCommentsByPostId(postId, { signal: request.signal }),
    ]);

    // 없는 postId 방어
    if (!post || !post.id) {
        throw new Response('Post Not Found', { status: 404 });
    }

    return {
        post,
        comments: Array.isArray(comments) ? comments : [],
    };
}
