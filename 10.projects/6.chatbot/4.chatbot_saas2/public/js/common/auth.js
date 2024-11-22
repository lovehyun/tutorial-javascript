// 인증 상태 관리
let isAuthenticated = false;

// 사용자 인증 상태를 확인하는 함수
async function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        isAuthenticated = false;
        return false;
    }

    try {
        const response = await fetch('/auth/me', {
            method: 'GET',
            headers: {
                'x-auth': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const accountInfo = document.getElementById('accountInfo');
            if (accountInfo) {
                accountInfo.innerText = `Logged in as: ${data.email}`;
            }
            isAuthenticated = true;
            return true;
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
    }

    isAuthenticated = false;
    return false;
}

// 로그인 상태를 업데이트하는 함수
function updateLoginStatus() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('loginLink');

    if (token && loginLink) {
        loginLink.innerText = 'Logout';
        loginLink.addEventListener('click', handleLogout);
    } else if (loginLink) {
        loginLink.innerText = 'Login';
        loginLink.href = '/login.html';
    }
}

// 로그아웃 처리 함수
function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '/'; // 홈으로 리디렉션
}

// 버튼 상태를 업데이트하는 함수
function updateButtonState() {
    const buttons = document.querySelectorAll('.auth-required');
    buttons.forEach(button => {
        button.disabled = !isAuthenticated;
    });
}

// 에러를 처리하는 함수
function handleError(response) {
    if (response.status === 401) {
        alert('Unauthorized access. Please log in.');
        window.location.href = '/login.html';
    } else {
        return response.json().then(data => {
            throw new Error(data.error || 'Unknown error');
        });
    }
}

// DOMContentLoaded 이벤트에서 필요한 작업 수행
document.addEventListener('DOMContentLoaded', async function () {
    await checkAuthentication(); // 인증 확인
    updateLoginStatus(); // 로그인 상태 업데이트
    updateButtonState(); // 버튼 상태 업데이트
});

// 전역 함수로 노출
window.checkAuthentication = checkAuthentication;
window.updateLoginStatus = updateLoginStatus;
window.updateButtonState = updateButtonState;
window.handleError = handleError;
