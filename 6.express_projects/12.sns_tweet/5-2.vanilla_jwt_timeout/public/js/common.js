function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

async function fetchWithAuth(url, options = {}) {
    let token = getAccessToken();
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(url, options);

    if (res.status === 401) {  // 토큰 만료나 인증 실패
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            // Refresh 토큰으로 Access 토큰 재발급 시도
            const refreshRes = await fetch('/api/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                localStorage.setItem('accessToken', data.accessToken);

                // 요청 다시 보내기
                token = data.accessToken;
                options.headers['Authorization'] = `Bearer ${token}`;
                res = await fetch(url, options);
            } else {
                // Refresh 실패 → 로그인 페이지로 이동
                logout();
                return res;
            }
        } else {
            // refreshToken 자체가 없음 → 바로 로그아웃
            logout();
            return res;
        }
    }

    return res;
}

async function fetchMe() {
    const res = await fetchWithAuth('/api/me');
    return res.ok ? await res.json() : null;
}

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

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login.html';
}

function showFlash(message, type='success') {
    const flash = document.getElementById('flash-message');
    flash.innerHTML = `<li class="${type}">${message}</li>`;
    setTimeout(() => {
        flash.innerHTML = '';
    }, 3000);
}

// let warnedAboutSession = false;

// function checkSessionExpiry() {
//     const expireTimeStr = localStorage.getItem('accessTokenExpireTime');
//     if (!expireTimeStr) return;

//     const expireTime = parseInt(expireTimeStr);
//     const now = Date.now();
//     const remainingMs = expireTime - now;
//     const remainingMinutes = remainingMs / (1000 * 60);

//     if (remainingMinutes <= 5 && !warnedAboutSession) {
//         warnedAboutSession = true;
//         alert('세션이 곧 만료됩니다. 저장하지 않은 데이터는 주의하세요!');
//     }
// }

// // 30초마다 주기적으로 세션 만료 체크 시작
// setInterval(checkSessionExpiry, 30 * 1000);

document.addEventListener('DOMContentLoaded', setupNav);
