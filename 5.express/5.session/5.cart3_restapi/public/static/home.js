import { fetchUserInfo } from './checkuser.js';

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    document.getElementById('login').addEventListener('click', login);
});

function checkLoginStatus() {
    fetchUserInfo()
    .then((username) => {
        if (username) {
            showProfile(username);
        } else {
            showLoginForm();
        }
    })
    .catch((error) => {
        console.error('사용자 정보를 가져오는 중 에러 발생:', error);
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => { // 응답값을 보고 처리도 가능 함
            if (response.status === 200) {
                // 로그인 성공
                return response.json();
            } else {
                // 로그인 실패 또는 다른 상태 코드 처리
                throw new Error('로그인 실패');
            }
        })
        .then(data => { // 파싱 한 데이터를 다시 프로세싱
            // console.log(data.message);
            alert(data.message);
            checkLoginStatus();
        })
        .catch(error => {
            // 여기에서 로그인 실패 또는 다른 오류 처리
            console.error('로그인 오류:', error);
            alert('로그인 실패');
        });
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
