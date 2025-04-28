let currentPage = 1; // 현재 페이지 번호
const limit = 20;    // 한 페이지당 20개 트윗

async function fetchTweets(page = 1) {
    const res = await fetch(`/api/tweets?page=${page}&limit=${limit}`);
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
    const tweets = await fetchTweets(currentPage);

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
        `;

        tweetsDiv.appendChild(div);
    });

    // 페이지 이동 버튼 추가
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';

    paginationDiv.innerHTML = `
        <button onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>이전</button>
        <span> 페이지 ${currentPage} </span>
        <button onclick="nextPage()">다음</button>
    `;

    tweetsDiv.appendChild(paginationDiv);
}

// 페이지 이동 함수
function nextPage() {
    currentPage++;
    renderTweets();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTweets();
    }
}

document.addEventListener('DOMContentLoaded', renderTweets);
