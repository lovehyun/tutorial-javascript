const BASE_PATH = '';  // 경로 prefix
// const BASE_PATH = '/tweet2';  // 경로 prefix
const BASE_URL = location.origin + BASE_PATH;

// 로그인 여부에 따라 네비게이션 메뉴 제어
async function setupNav() {
    const user = await fetchMe();

    if (user) {
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-logout').style.display = 'inline';
        document.getElementById('nav-profile').style.display = 'inline';
        document.getElementById('nav-tweet').style.display = 'inline';
    } else {
        document.getElementById('nav-login').style.display = 'inline';
        document.getElementById('nav-logout').style.display = 'none';
        document.getElementById('nav-profile').style.display = 'none';
        document.getElementById('nav-tweet').style.display = 'none';
    }
}

// 플래시 메시지 출력
function showFlash(message, type='success') {
    const flash = document.getElementById('flash-message');
    flash.innerHTML = `
        <div class="mb-4">
            <div class="p-4 rounded-lg shadow-md ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${message}
            </div>
        </div>
    `;
    setTimeout(() => {
        flash.innerHTML = '';
    }, 3000);
}


// API로 현재 사용자 정보 가져오기
async function fetchMe() {
    const res = await fetch(`${BASE_URL}/api/me`);
    return await res.json();
}

// 로그아웃 처리
async function logout() {
    await fetch(`${BASE_URL}/api/logout`, { method: 'POST' });
    window.location.href = `${BASE_URL}/login.html`;
}

// 페이지 로드 시 메뉴 설정
document.addEventListener('DOMContentLoaded', setupNav);
