document.addEventListener('DOMContentLoaded', () => {
    fetchUserInfo();
});

// 사용자 정보를 가져오는 비동기 함수
async function fetchUserInfo() {
    try {
        const response = await fetch('/api/check-login');
        const userData = await response.json();

        // 사용자 정보 업데이트
        if (userData.username) {
            document.getElementById('user-info').innerHTML = `
                ${userData.username} 님
                <span class="logout-btn" onclick="logout()">Logout</span>
            `;
            document.getElementById('user-info').style.display = 'block';
        } else {
            document.getElementById('user-info').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

function logout() {
    fetch('/api/logout', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            if (data.redirectUrl) {
                // 리다이렉트 URL이 존재하는 경우 페이지를 이동
                window.location.href = data.redirectUrl;
            } else {
                // 리다이렉트 URL이 없는 경우 페이지를 새로고침
                window.location.reload();
            }
        });
}
