async function fetchTweets() {
    const res = await fetch('/api/tweets');
    return await res.json();
}

async function likeTweet(id) {
    await fetch(`/api/like/${id}`, { method: 'POST' });
    renderTweets();
}

async function unlikeTweet(id) {
    await fetch(`/api/unlike/${id}`, { method: 'POST' });
    renderTweets();
}

async function deleteTweet(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        await fetch(`/api/tweet/${id}`, { method: 'DELETE' });
        renderTweets();
    }
}

async function renderTweets() {
    const user = await fetchMe();
    const tweets = await fetchTweets();

    const tweetsDiv = document.getElementById('tweets');
    tweetsDiv.innerHTML = '';

    tweets.forEach(tweet => {
        const div = document.createElement('div');
        div.className = 'tweet';

        div.innerHTML = `
            <div class="tweet-body-row">
                <p class="tweet-content">${tweet.content}</p>
                ${user && user.id === tweet.user_id ? `
                    <form onsubmit="event.preventDefault(); deleteTweet(${tweet.id});" class="delete-form">
                        <button type="submit">X</button>
                    </form>
                ` : ''}
            </div>
            <p class="tweet-author">- ${tweet.username} -</p>
            <div class="tweet-actions">
                ${user ? `
                    ${tweet.liked_by_current_user ? `
                        <button onclick="unlikeTweet(${tweet.id})">Unlike</button>
                    ` : `
                        <button onclick="likeTweet(${tweet.id})">Like</button>
                    `}
                ` : `
                    <p><a href="/login.html">Log in to like</a></p>
                `}
                <span class="likes-count">Likes: ${tweet.likes_count}</span>
            </div>

            <!-- 댓글 목록 영역 -->
            <div class="comments" id="comments-${tweet.id}"></div>

            <!-- 댓글 작성 폼 -->
            ${user ? `
            <form onsubmit="submitComment(event, ${tweet.id})" class="comment-form">
                <input type="text" id="comment-input-${tweet.id}" placeholder="댓글 달기..." required />
                <button type="submit">작성</button>
            </form>
            ` : ''}
        `;

        loadComments(tweet.id); // 댓글 불러오는 함수 추가

        tweetsDiv.appendChild(div);
    });
}

async function loadComments(tweetId) {
    const res = await fetch(`/api/comments/${tweetId}`);
    const comments = await res.json();
    const user = await fetchMe();

    const commentsDiv = document.getElementById(`comments-${tweetId}`);
    commentsDiv.innerHTML = comments.map(comment => `
        <div class="comment-item" id="comment-${comment.id}">
            <small><strong>${comment.username}</strong>: <span id="comment-content-${comment.id}">${comment.content}</span></small>
            ${user && user.id === comment.user_id ? `
                <button onclick="showEditComment(${comment.id}, ${tweetId})">수정</button>
                <button onclick="deleteComment(${comment.id}, ${tweetId})">삭제</button>
            ` : ''}
        </div>
    `).join('');
}

async function submitComment(event, tweetId) {
    event.preventDefault();
    const input = document.getElementById(`comment-input-${tweetId}`);
    const content = input.value.trim();

    if (!content) return;

    await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet_id: tweetId, content })
    });

    input.value = '';
    loadComments(tweetId); // 댓글 다시 불러오기
}

function showEditComment(commentId, tweetId) {
    const commentDiv = document.getElementById(`comment-${commentId}`);
    const originalContent = document.getElementById(`comment-content-${commentId}`).innerText;

    commentDiv.innerHTML = `
        <form onsubmit="submitEditComment(event, ${commentId}, ${tweetId})" class="edit-comment-form">
            <input type="text" id="edit-comment-input-${commentId}" value="${originalContent}" required />
            <button type="submit">수정 완료</button>
            <button type="button" onclick="cancelEditComment(${tweetId})">취소</button>
        </form>
    `;
}

async function submitEditComment(event, commentId, tweetId) {
    event.preventDefault();
    const input = document.getElementById(`edit-comment-input-${commentId}`);
    const content = input.value.trim();

    if (!content) return;

    await fetch(`/api/comment/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });

    loadComments(tweetId); // 수정 완료 후 댓글 다시 로드
}

async function cancelEditComment(tweetId) {
    await loadComments(tweetId); // 댓글 다시 로딩 (원래 상태로 복구)
}

async function deleteComment(commentId, tweetId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    await fetch(`/api/comment/${commentId}`, {
        method: 'DELETE'
    });

    loadComments(tweetId); // 삭제 후 댓글 다시 로드
}

document.addEventListener('DOMContentLoaded', renderTweets);
