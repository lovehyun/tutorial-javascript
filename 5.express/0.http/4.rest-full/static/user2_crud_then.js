document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const userTable = document.getElementById('userTable');

    // 페이지 로딩 시 백엔드의 /user API 호출하여 테이블 생성
    updateTable();

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const name = username.value;

        if (!name) {
            alert('이름을 입력하세요.');
            return;
        }

        registerUser(name) // 내부에서 fetch 후 promise 를 반환
            .then(() => {
                alert('등록 성공');
                username.value = ''; // 입력 필드 초기화
                return updateTable(); // 테이블 갱신
            })
            .catch(error => {
                console.error('등록 중 오류 발생:', error);
                alert('등록 중 오류가 발생했습니다.');
            });
    });
});

// 사용자 등록 함수
function registerUser(name) {
    return fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(`등록 실패: ${errorMessage}`);
            });
        }
    });
}

// 사용자 정보를 받아와 테이블에 표시하는 함수
function displayUsers(users) {
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = ''; // 테이블 초기화

    if (Object.keys(users).length === 0) {
        const messageRow = document.createElement('div');
        messageRow.textContent = '등록된 사용자가 없습니다.';
        userTable.appendChild(messageRow);
    } else {
        for (const key in users) {
            const row = document.createElement('div');
            row.innerHTML = `<strong>ID:</strong> ${key}, <strong>Name:</strong> ${users[key]}`;

            // 수정 버튼 추가
            const editButton = document.createElement('button');
            editButton.textContent = '수정';
            editButton.addEventListener('click', () => editUser(key));
            row.appendChild(editButton);

            // 삭제 버튼 추가
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.addEventListener('click', () => deleteUser(key));
            row.appendChild(deleteButton);

            userTable.appendChild(row);
        }
    }
}

// 테이블 갱신을 위한 함수
function updateTable() {
    return fetch('/user')
        .then(response => response.json())
        .then(users => displayUsers(users))
        .catch(error => console.error('사용자 정보 불러오기 실패:', error));
}

// 사용자 정보 수정 함수
function editUser(userId) {
    const newName = prompt('수정할 이름을 입력하세요.');
    if (newName !== null) {
        fetch(`/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error(`수정 실패: ${errorMessage}`);
                });
            }
            alert('수정 성공');
            return updateTable(); // 수정 성공 시 테이블 갱신
        })
        .catch(error => {
            console.error('수정 중 오류 발생:', error);
            alert('수정 중 오류가 발생했습니다.');
        });
    }
}

// 사용자 정보 삭제 함수
function deleteUser(userId) {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
        fetch(`/user/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error(`삭제 실패: ${errorMessage}`);
                });
            }
            alert('삭제 성공');
            return updateTable(); // 삭제 성공 시 테이블 갱신
        })
        .catch(error => {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        });
    }
}
