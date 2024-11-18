async function submitForm() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var rememberMe = document.getElementById('rememberMe').checked;

    try {
        // 로그인 요청
        const loginResponse = await axios.post('/api/login', {
            username,
            password,
        });

        const { token } = loginResponse.data;

        // 쿠키에 토큰과 username 저장
        document.cookie = `token=${token}; username=${username}; path=/;`;

        // Remember me가 선택된 경우 로컬 스토리지에 토큰 저장
        if (rememberMe) {
            localStorage.setItem('token', token);
        }
        
        // 로그인 이후 이름 저장
        localStorage.setItem('username', username);

        // 토큰 유효성 검사 요청
        const validateResponse = await axios.post('/api/validateToken', null, {
            headers: {
                Authorization: `Bearer ${token}`,  // 로그인 요청에 토큰을 헤더에 추가
            },
        });

        const { valid, userId, username: validatedUsername } = validateResponse.data;

        if (valid) {
            // 성공적으로 로그인 및 토큰 유효성 검사가 완료된 경우
            console.log('로그인 성공');
            console.log('User ID:', userId);
            console.log('Username:', validatedUsername);

            // 여기에서 필요한 작업을 수행할 수 있습니다.
            displayUserInfo(validatedUsername);

            // 로그인 성공 후 홈페이지로 이동
            window.location.href = '/main';
        } else {
            console.log('토큰 유효성 검사 실패');
        }
    } catch (error) {
        // 에러 응답이 있는 경우에만 처리
        if (error.response) {
            // console.error('로그인 실패:', error.response.data.message);
            displayMessage(`로그인 실패: ${error.response.data.message}`);
        } else {
            // console.error('로그인 실패:', error.message);
            displayMessage(`로그인 실패: ${error.message}`);
        }
    }
}

// 쿠키에서 특정 이름의 쿠키 값 가져오기
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return '';
}

function displayUserInfo(username) {
    // userInfo 엘리먼트를 찾아서 텍스트를 설정
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.innerText = `Logged in as: ${username}`;
    } else {
        console.error('userInfo 엘리먼트를 찾을 수 없습니다.');
    }
}

function displayMessage(message) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerText = message;
    } else {
        console.error('message 엘리먼트를 찾을 수 없습니다.');
    }
}
