document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    fetch('/api/check-login')
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                showProfile(data.username);
            } else {
                showLoginForm();
            }
        })
        .catch(error => {
            console.error('로그인 상태 확인 오류:', error);
            showLoginForm();
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
            // 로그인 성공한 경우에만 checkLoginStatus 호출
            // console.log(data.message);
            alert(data.message);
            checkLoginStatus();
        })
        .catch(error => {
            // 여기에서 로그인 실패 또는 다른 오류 처리
            // console.error('로그인 오류:', error);
            alert('로그인 실패');
        });
}

function logout() {
    fetch('/api/logout')
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('로그아웃 실패');
            }
        })
        .then(data => {
                showLoginForm();
                alert(data.message);

                // 로그아웃 성공 후 redirectUrl이 존재하면 해당 URL로 이동
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
        })
        .catch(error => {
            alert('로그아웃 실패');
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
