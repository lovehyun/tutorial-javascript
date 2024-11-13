document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 막기

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username,
                password
            })
        });

        if (response.redirected) {
            // 로그인 성공 시 프로필 페이지로 리다이렉트
            window.location.href = response.url;
        } else {
            // 로그인 실패 시 메시지 표시
            const message = await response.text();
            document.getElementById('login-message').textContent = message;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('login-message').textContent = '로그인 요청 중 오류가 발생했습니다.';
    }
});
