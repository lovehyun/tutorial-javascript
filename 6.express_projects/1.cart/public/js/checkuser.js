// 사용자 정보를 가져오는 비동기 함수
export async function fetchUserInfo() {
    try {
        const response = await fetch('/api/check-login');
        const userData = await response.json();

        // 사용자 정보 업데이트
        if (userData.username) {
            document.getElementById('user-info').innerHTML = `
                ${userData.username} 님
                <span class="logout-btn" id="logout">Logout</span>
            `;
            document.getElementById('user-info').style.display = 'block';

            // 이벤트 핸들러 추가 
            document.getElementById('logout').addEventListener('click', logout);
            
            return userData.username;
        } else {
            document.getElementById('user-info').style.display = 'none';
            return null;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
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
            console.log(data);
            alert(data.message);

            // 로그아웃 성공 후 redirectUrl이 존재하면 해당 URL로 이동
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                // 리다이렉트 URL이 없는 경우 페이지를 새로고침
                window.location.reload();
            }
        })
        .catch(error => {
            alert('로그아웃 실패');
        });
}
