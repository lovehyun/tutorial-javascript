document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    document.getElementById('logout-button').addEventListener('click', logout);
});

async function loadProfileData() {
    try {
        const response = await fetch('/profile-data');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('username').textContent = data.username;
            document.getElementById('email').textContent = data.email;
            document.getElementById('created_at').textContent = data.created_at;
            document.getElementById('role').textContent = data.role;
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('프로필 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
}

async function logout() {
    try {
        const response = await fetch('/logout');
        if (response.ok) {
            window.location.href = '/'; // 로그아웃 후 홈 페이지로 이동
        } else {
            console.error('로그아웃에 실패했습니다.');
        }
    } catch (error) {
        console.error('로그아웃 요청 중 오류가 발생했습니다:', error);
    }
}
