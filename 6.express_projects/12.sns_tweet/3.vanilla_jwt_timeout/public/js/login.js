async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const keepLoggedIn = document.getElementById('keep-logged-in').checked;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        // 세션 만료 5분전 팝업을 띄우기 위한 추가 설정
        // setTokens({
        //     accessToken: data.accessToken,
        //     refreshToken: keepLoggedIn ? data.refreshToken : undefined,
        //     refreshTokenIssuedAt: keepLoggedIn ? data.refreshTokenIssuedAt : undefined,
        //     accessTokenExpiresIn: 3600  // (1시간 = 3600초)
        // });

        localStorage.setItem('accessToken', data.accessToken);
        if (keepLoggedIn) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        showFlash('로그인 성공!', 'success');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 500);
    } else {
        const error = await res.json();
        showFlash(error.error || '로그인 실패', 'danger');
    }
}
