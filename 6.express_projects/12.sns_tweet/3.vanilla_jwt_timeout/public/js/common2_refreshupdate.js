function getAccessToken() {
    return localStorage.getItem('accessToken');
}

function getRefreshToken() {
    return localStorage.getItem('refreshToken');
}

function getRefreshTokenIssuedAt() {
    return parseInt(localStorage.getItem('refreshTokenIssuedAt') || '0');
}

function setTokens({ accessToken, refreshToken, refreshTokenIssuedAt }) {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (refreshTokenIssuedAt) localStorage.setItem('refreshTokenIssuedAt', refreshTokenIssuedAt.toString());
}

// 만료 5분 전에 팝업창으로 알리기 위해 만료 예정 시간을 저장
// function setTokens({ accessToken, refreshToken, refreshTokenIssuedAt, accessTokenExpiresIn }) {
//     if (accessToken) {
//         localStorage.setItem('accessToken', accessToken);

//         if (accessTokenExpiresIn) {
//             const expireTime = Date.now() + accessTokenExpiresIn * 1000; // ms로 변환
//             localStorage.setItem('accessTokenExpireTime', expireTime.toString());
//         }
//     }
//     if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
//     if (refreshTokenIssuedAt) localStorage.setItem('refreshTokenIssuedAt', refreshTokenIssuedAt.toString());
// }

async function rotateRefreshTokenIfNeeded() {
    const issuedAt = getRefreshTokenIssuedAt();
    if (!issuedAt) return;

    const now = Date.now();
    const daysPassed = (now - issuedAt) / (1000 * 60 * 60 * 24);

    if (daysPassed >= 25) {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return;

        const res = await fetch('/api/rotate_refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (res.ok) {
            const data = await res.json();
            setTokens({ refreshToken: data.refreshToken, refreshTokenIssuedAt: data.refreshTokenIssuedAt });
            console.log('Refresh Token 갱신 완료');
        } else {
            console.log('Refresh Token 갱신 실패');
            alert('세션 갱신에 실패했습니다. 다시 로그인해 주세요.');
            logout();
        }
    }
}

async function fetchWithAuth(url, options = {}) {
    await rotateRefreshTokenIfNeeded(); // 매 호출시 체크

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
                alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
                logout();
                return res;
            }
        } else {
            // refreshToken 자체가 없음 → 바로 로그아웃
            alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
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
    localStorage.removeItem('refreshTokenIssuedAt');
    window.location.href = '/login.html';
}

function showFlash(message, type='success') {
    const flash = document.getElementById('flash-message');
    flash.innerHTML = `<li class="${type}">${message}</li>`;
    setTimeout(() => {
        flash.innerHTML = '';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', setupNav);
