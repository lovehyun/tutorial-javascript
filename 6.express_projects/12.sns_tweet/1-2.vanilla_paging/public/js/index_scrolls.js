let currentPage = 1; // 현재 페이지
const limit = 20;    // 한 번에 가져올 트윗 수
let isLoading = false; // 중복 요청 방지
let isEnd = false;     // 마지막 페이지 도달 여부

async function fetchTweets(page = 1) {
    const res = await fetch(`/api/tweets?page=${page}&limit=${limit}`);
    return await res.json();
}

async function likeTweet(id) {
    await fetch(`/api/like/${id}`, { method: 'POST' });
    reloadTweets(); // 좋아요 후 다시 그리기
}

async function unlikeTweet(id) {
    await fetch(`/api/unlike/${id}`, { method: 'POST' });
    reloadTweets(); // 좋아요 후 다시 그리기
}

async function deleteTweet(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        await fetch(`/api/tweet/${id}`, { method: 'DELETE' });
        reloadTweets(); // 삭제 후 다시 그리기
    }
}

async function renderTweets(tweets, user) {
    const tweetsDiv = document.getElementById('tweets');

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
        `;

        tweetsDiv.appendChild(div);
    });
}

async function loadMoreTweets() {
    if (isLoading || isEnd) return;

    isLoading = true;

    const user = await fetchMe();
    const tweets = await fetchTweets(currentPage);

    if (tweets.length < limit) {
        isEnd = true; // 마지막 페이지 도달
    }

    await renderTweets(tweets, user);

    currentPage++;
    isLoading = false;
}

async function reloadTweets() {
    const tweetsDiv = document.getElementById('tweets');
    tweetsDiv.innerHTML = '';
    currentPage = 1;
    isEnd = false;
    await loadMoreTweets();
}

// 스크롤 이벤트
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreTweets();
    }
});

document.addEventListener('DOMContentLoaded', loadMoreTweets);
