const userDetailContainer = document.getElementById('user-detail-container');

// 현재 URL에서 사용자 ID를 추출
const userId = window.location.pathname.split('/').pop();

function fetchUserDetail() {
    fetch(`/api/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            return response.json();
        })
        .then(user => {
            renderUserDetail(user);
        })
        .catch(error => {
            userDetailContainer.innerHTML = `<p>${error.message}</p>`;
        });
}

function renderUserDetail(user) {
    const table = document.createElement('table');
    const fields = Object.keys(user);

    // 테이블 헤더
    const headerRow = document.createElement('tr');
    const headers = ['필드', '값'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // 테이블 데이터
    fields.forEach(field => {
        const row = document.createElement('tr');

        const fieldName = document.createElement('td');
        fieldName.textContent = field;
        row.appendChild(fieldName);

        const fieldValue = document.createElement('td');
        fieldValue.textContent = user[field];
        row.appendChild(fieldValue);

        table.appendChild(row);
    });

    userDetailContainer.innerHTML = ''; // 기존 내용 초기화
    userDetailContainer.appendChild(table);
}

// 사용자 상세 정보 가져오기
fetchUserDetail();
