// script/autologin.js

// 페이지 로드 시 초기화
function initialize() {
    // 페이지 로드 시 자동 로그인 시도
    checkAndAutoLogin();
    updateUI();
}

// 페이지 로드 시 초기화 실행
initialize();

// 페이지 로드 시 자동 로그인 시도
async function checkAndAutoLogin() {
    // 로컬 스토리지에서 토큰 가져오기
    const tokenToCheck = localStorage.getItem('token');

    if (tokenToCheck) {
        try {
            // 토큰 유효성 검사 요청
            const validateResponse = await axios.post('/api/validateToken', null, {
                headers: {
                    Authorization: `Bearer ${tokenToCheck}`,  // 로그인 요청에 토큰을 헤더에 추가
                },
            });

            const { valid, userId, username } = validateResponse.data;

            if (valid) {
                // 성공적으로 토큰 유효성 검사가 완료된 경우
                console.log('자동 로그인 성공');
                console.log('User ID:', userId);
                console.log('Username:', username);

                // 로컬 스토리지에 사용자 정보 저장
                localStorage.setItem('username', username);

                // 여기에서 필요한 작업을 수행할 수 있습니다.
                displayUserInfo(username);
                updateUI();

                return true;
            } else {
                console.log('토큰 유효성 검사 실패');
            }
        } catch (error) {
            console.error('자동 로그인 실패:', error.response?.data?.message);
        }
    }

    return false;
}

// 사용자 정보 표시
function displayUserInfo(username) {
    document.getElementById('userInfo').innerText = `Logged in as: ${username}`;
}

// 로그인 여부에 따라 UI 업데이트
function updateUI() {
    // 쿠키에서 로그인정보 가져오기
    const username = localStorage.getItem('username');

    const loginButton = document.querySelector('.btn-primary');

    if (username) {
        // 로그인 상태
        loginButton.innerText = 'Logout';
    } else {
        // 로그아웃 상태
        loginButton.innerText = 'Login';
    }
}

// 로그인 또는 로그아웃 동작 처리
function handleAuthAction() {
    // 쿠키에서 로그인정보 가져오기
    const username = localStorage.getItem('username');

    if (username) {
        // 이미 로그인된 상태이면 로그아웃
        logout();
    } else {
        // 로그인되지 않은 상태이면 로그인 페이지로 이동
        login();
    }
}

// 로그인
function login() {
    // 로그인 페이지로 이동 또는 로그인 모달 열기 등의 동작을 수행
    // 여기에서는 단순히 로그인 페이지로 이동하는 예시를 제공
    window.location.href = '/login';
}

// 로그아웃
function logout() {
    // 필요시 서버에도 로그아웃 요청
    logoutRequest();

    // 쿠키에서 토큰과 username 제거
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // UI 업데이트
    window.location.href = '/';
}

// 로그아웃 요청
async function logoutRequest() {
    try {
        const response = await axios.post('http://localhost:3000/api/logout');

        const { success } = response.data;
        if (success) {
            // 로그아웃 성공
            console.log('로그아웃 성공');
        } else {
            console.log('로그아웃 실패');
        }
    } catch (error) {
        console.error('로그아웃 실패:', error.response.data.message);
    }
}

// 쿠키에서 특정 이름의 쿠키 값 가져오기
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        console.log('Cookie:', cookie);  // 각 쿠키의 값을 확인하기 위해 추가
        if (cookieName.trim() === name) {
            console.log('Found Cookie:', cookieValue);  // 찾은 쿠키의 값을 확인하기 위해 추가
            return cookieValue;
        }
    }
    console.log('Cookie Not Found');
    return '';
}
