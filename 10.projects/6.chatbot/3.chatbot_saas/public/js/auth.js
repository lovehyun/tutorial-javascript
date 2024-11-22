document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태를 업데이트하는 함수
    function updateLoginStatus() {
        const token = localStorage.getItem('token'); // 로컬 스토리지에서 저장된 토큰 가져오기
        const loginLink = document.getElementById('loginLink'); // 로그인/로그아웃 버튼 찾기
        if (token && loginLink) {
            // 토큰이 있고 로그인 링크가 있을 경우
            loginLink.innerText = 'Logout'; // 버튼 텍스트를 "Logout"으로 변경
            loginLink.removeEventListener('click', handleLogout); // 기존 이벤트 리스너 제거
            loginLink.addEventListener('click', handleLogout); // 새로운 로그아웃 이벤트 리스너 추가
        
            // 서버에서 사용자 정보 가져오기
            fetch('/auth/me', {
                method: 'GET',
                headers: {
                    'x-auth': token, // 인증 토큰을 헤더에 추가
                },
            })
            .then(response => {
                if (!response.ok) {
                    // 응답이 성공적이지 않을 경우 오류 처리
                    throw new Error('Failed to fetch user info');
                }
                return response.json(); // 응답 데이터를 JSON 형식으로 파싱
            })
            .then(data => {
                // 사용자 정보를 표시할 DOM 요소를 찾아 사용자 이메일을 표시
                const accountInfo = document.getElementById('accountInfo');
                if (accountInfo) {
                    accountInfo.innerText = `Logged in as: ${data.email}`;
                }
            })
            .catch(error => console.error('Error:', error)); // 오류 출력
        }
    }

    // 로그아웃 처리를 담당하는 함수
    function handleLogout(event) {
        event.preventDefault(); // 기본 동작 방지
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 삭제
        alert('Logged out successfully!'); // 로그아웃 성공 알림
        window.location.href = '/'; // 홈 페이지로 리다이렉트
    }

    // 인증되지 않은 접근 오류를 처리하는 함수
    function handleUnauthorizedError() {
        const errorContainer = document.getElementById('errorContainer'); // 오류 메시지를 표시할 DOM 요소
        if (errorContainer) {
            errorContainer.innerText = 'Unauthorized access. Please log in.'; // 오류 메시지 표시
        } else {
            alert('Unauthorized access. Please log in.'); // 경고창으로 오류 알림
        }
    }

    // 서버 응답 오류를 처리하는 함수
    function handleError(response) {
        if (response.status === 401) {
            // 401 (Unauthorized) 응답 처리
            handleUnauthorizedError();
        } else {
            // 다른 오류의 경우, 응답 데이터를 파싱하여 오류 메시지 생성
            return response.json().then(data => {
                throw new Error(data.error || 'Unknown error');
            });
        }
    }

    // 페이지 로드 시 로그인 상태 확인
    updateLoginStatus();

    // 다른 스크립트에서 사용할 수 있도록 오류 처리 함수 노출
    window.handleError = handleError;
});
