async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        showFlash('로그인 성공!', 'success');
        setTimeout(() => {
            window.location.href = `${BASE_URL}/index.html`;
        }, 500);
    } else {
        const error = await res.json();
        showFlash(error.error || '로그인 실패', 'danger');
    }
}
