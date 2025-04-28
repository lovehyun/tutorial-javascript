let currentPage = 1;
const limit = 20; // 한 번에 20개씩
let isLoading = false;
let isEnd = false;

async function fetchTweets(page = 1) {
    const res = await fetch(`${BASE_URL}/api/tweets?page=${page}&limit=${limit}`);
    return await res.json();
}

async function likeTweet(id) {
    await fetch(`${BASE_URL}/api/like/${id}`, { method: 'POST' });
    reloadTweets();
}

async function unlikeTweet(id) {
    await fetch(`${BASE_URL}/api/unlike/${id}`, { method: 'POST' });
    reloadTweets();
}

function openConfirm(onConfirm) {
    const modal = document.getElementById('confirm-modal');
    modal.classList.remove('hidden');

    const yesBtn = document.getElementById('confirm-yes');
    const noBtn = document.getElementById('confirm-no');

    const cleanup = () => {
        modal.classList.add('hidden');
        yesBtn.removeEventListener('click', yesHandler);
        noBtn.removeEventListener('click', noHandler);
    };

    const yesHandler = () => {
        cleanup();
        onConfirm();
    };
    const noHandler = () => {
        cleanup();
    };

    yesBtn.addEventListener('click', yesHandler);
    noBtn.addEventListener('click', noHandler);
}

async function deleteTweet(id) {
    openConfirm(async () => {
        await fetch(`${BASE_URL}/api/tweet/${id}`, { method: 'DELETE' });
        reloadTweets();
    });
}

async function renderTweets(tweets, user) {
    const tweetsDiv = document.getElementById('tweets');

    tweets.forEach(tweet => {
        const div = document.createElement('div');
        div.className = 'bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 mb-4';

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <p class="text-lg font-semibold">${tweet.content}</p>
                ${user && user.id === tweet.user_id ? `
                    <form onsubmit="event.preventDefault(); deleteTweet(${tweet.id});" class="ml-2">
                        <button type="submit" class="text-red-500 hover:text-red-700 text-xl">×</button>
                    </form>
                ` : ''}
            </div>
            <p class="text-sm text-gray-500 mb-4">- ${tweet.username} -</p>
            <div class="flex justify-between items-center">
                ${user ? `
                    ${tweet.liked_by_current_user ? `
                        <button onclick="unlikeTweet(${tweet.id})" class="text-blue-500 hover:underline">Unlike</button>
                    ` : `
                        <button onclick="likeTweet(${tweet.id})" class="text-gray-500 hover:underline">Like</button>
                    `}
                ` : `<p class="text-gray-400 text-sm">로그인 후 좋아요 가능</p>`}
                <span class="text-sm text-gray-600">Likes: ${tweet.likes_count}</span>
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
        isEnd = true; // 마지막 페이지
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

// 스크롤 감지해서 무한스크롤
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        loadMoreTweets();
    }
});

document.addEventListener('DOMContentLoaded', loadMoreTweets);
