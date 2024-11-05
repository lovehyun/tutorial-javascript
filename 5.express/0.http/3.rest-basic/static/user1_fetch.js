document.addEventListener('DOMContentLoaded', () => {
    const userTable = document.getElementById('userTable');

    // fetch 요청과 JSON 파싱을 콜백 헬 형태로 구현
    fetch('/user', {
        method: 'GET'
    }).then(response => {
        response.json().then(users => {
            // JSON 파싱이 성공적으로 완료된 경우 사용자 정보를 테이블에 표시
            userTable.innerHTML = ''; // 테이블 초기화

            if (Object.keys(users).length === 0) {
            // if (JSON.stringify(users) === '{}') { // users 가 비었는지 확인하는 다양한 방법
                const messageRow = document.createElement('div');
                messageRow.textContent = '등록된 사용자가 없습니다.';
                userTable.appendChild(messageRow);
            } else {
                for (const key in users) {
                    const row = document.createElement('div');
                    row.innerHTML = `<strong>ID:</strong> ${key}, <strong>Name:</strong> ${users[key]}`;
                    userTable.appendChild(row);
                }
            }
        }).catch(error => {
            // JSON 파싱 중 오류 발생 시
            console.error('JSON 파싱 오류:', error);
        });
    }).catch(error => {
        // fetch 요청 중 오류 발생 시
        console.error('사용자 정보 불러오기 실패:', error);
    });
});
