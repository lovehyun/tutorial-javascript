document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const userTable = document.getElementById('userTable');

    // 페이지 로딩 시 백엔드의 /users API 호출하여 테이블 생성
    fetch('/user')
        .then(response => response.json())
        .then(users => displayUsers(users))
        .catch(error => console.error('사용자 정보 불러오기 실패:', error));
});

// 사용자 정보를 받아와 테이블에 표시하는 함수
function displayUsers(users) {
    userTable.innerHTML = ''; // 테이블 초기화

    if (Object.keys(users).length === 0) {
        // 사용자 정보가 없는 경우 메시지 표시
        const messageRow = document.createElement('div');
        messageRow.textContent = '등록된 사용자가 없습니다.';
        userTable.appendChild(messageRow);
    } else {
        // 테이블 생성
        for (const key in users) {
            const row = document.createElement('div');
            row.innerHTML = `<strong>ID:</strong> ${key}, <strong>Name:</strong> ${users[key]}`;
            userTable.appendChild(row);
        }
    }
}
