document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    // 사용자의 활동을 감지하여 performUserActivity 호출
    document.addEventListener('click', performUserActivity);
    // 또는 다른 이벤트에 따라 호출할 수 있음
    // document.addEventListener('mousemove', performUserActivity);
    // document.addEventListener('keydown', performUserActivity);
});

function checkLoginStatus() {
    fetch('/check-login')
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

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json()) // 서버로 부터 받은 메세지를 json 으로 파싱
    .then(data => { // 파싱 한 데이터를 다시 프로세싱
        if (data.message === '로그인 성공!') {
            // 로그인 성공한 경우에만 checkLoginStatus 호출
            checkLoginStatus();
        } else {
            alert('로그인 실패');
        }
    });
}

function login2() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
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
        console.log(data.message);
        checkLoginStatus();
    })
    .catch(error => {
        // 여기에서 로그인 실패 또는 다른 오류 처리
        console.error('로그인 오류:', error);
        alert('로그인 실패');
    });
}

function logout() {
    fetch('/logout')
    .then(response => response.json())
    .then(data => {
        if (data.message === '로그아웃 성공!') {
            showLoginForm();
        } else {
            alert('로그아웃 실패');
        }
    });
}

// 추가미션
function performUserActivity() {
    // 사용자의 활동이 있을 때마다 서버에 요청을 보냄
    fetch('/user-activity')
        .then(response => response.json())
        .then(data => {
            // 서버에서 세션을 갱신한 경우에는 특별한 처리를 할 수 있음
            console.log('User activity performed:', data.message);
        })
        .catch(error => {
            console.error('User activity error:', error);
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
