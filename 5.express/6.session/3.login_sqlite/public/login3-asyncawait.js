document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    // 로그인 및 로그아웃 버튼에 이벤트 리스너 추가
    document.getElementById('loginButton').addEventListener('click', login);
    document.getElementById('logoutButton').addEventListener('click', logout);

    // 사용자의 활동을 감지하여 performUserActivity 호출
    document.addEventListener('click', performUserActivity);
    // 또는 다른 이벤트에 따라 호출할 수 있음
    // document.addEventListener('mousemove', performUserActivity);
    // document.addEventListener('keydown', performUserActivity);
});

async function checkLoginStatus() {
    try {
        const response = await fetch('/check-login');
        const data = await response.json();
        
        if (data.username) {
            showProfile(data.username);
        } else {
            showLoginForm();
        }
    } catch (error) {
        console.error('로그인 상태 확인 오류:', error);
        showLoginForm();
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (data.message === '로그인 성공!') {
            checkLoginStatus();
        } else {
            alert('로그인 실패');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 실패');
    }
}

async function login2() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 200) {
            const data = await response.json();
            console.log(data.message);
            checkLoginStatus();
        } else {
            throw new Error('로그인 실패');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 실패');
    }
}

async function logout() {
    try {
        const response = await fetch('/logout');
        const data = await response.json();
        
        if (data.message === '로그아웃 성공!') {
            showLoginForm();
        } else {
            alert('로그아웃 실패');
        }
    } catch (error) {
        console.error('로그아웃 오류:', error);
        alert('로그아웃 실패');
    }
}

// 추가미션
async function performUserActivity() {
    try {
        const response = await fetch('/user-activity');
        const data = await response.json();
        console.log('User activity performed:', data.message);
    } catch (error) {
        console.error('User activity error:', error);
    }
}

function showProfile(username) {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('profile').style.display = 'block';
    document.getElementById('usernameSpan').innerText = username;
}

function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('profile').style.display = 'none';
}
