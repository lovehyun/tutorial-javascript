document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const userTable = document.getElementById('userTable');

    // 페이지 로딩 시 백엔드의 /users API 호출하여 테이블 생성
    await updateTable();

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const name = username.value;

        if (!name) {
            alert('이름을 입력하세요.');
            return;
        }

        try {
            const response = await fetch('/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                alert('등록 성공');
                username.value = ''; // 입력 필드 초기화

                // 등록 성공 시 테이블 갱신
                await updateTable();
            } else {
                const errorMessage = await response.text();
                alert(`등록 실패: ${errorMessage}`);
            }
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
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
                row.innerHTML = `<strong>ID:</strong> ${key}, <strong>Name:</strong> ${users[key]} 
                                <button onclick="editUser('${key}')">수정</button>
                                <button onclick="deleteUser('${key}')">삭제</button>`;
                userTable.appendChild(row);
            }
        }
    }

    // 테이블 갱신을 위한 함수
    async function updateTable() {
        await fetch('/user')
            .then(response => response.json())
            .then(users => displayUsers(users))
            .catch(error => console.error('사용자 정보 불러오기 실패:', error));
    }

    // 사용자 정보 수정 함수
    async function editUser(userId) {
        const newName = prompt('수정할 이름을 입력하세요.');
        if (newName !== null) {
            try {
                const response = await fetch(`/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName }),
                });

                if (response.ok) {
                    alert('수정 성공');
                    // 수정 성공 시 테이블 갱신
                    await updateTable();
                } else {
                    const errorMessage = await response.text();
                    alert(`수정 실패: ${errorMessage}`);
                }
            } catch (error) {
                console.error('수정 중 오류 발생:', error);
                alert('수정 중 오류가 발생했습니다.');
            }
        }
    };

    // 사용자 정보 삭제 함수
    async function deleteUser(userId) {
        const confirmDelete = confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/user/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('삭제 성공');
                    // 삭제 성공 시 테이블 갱신
                    await updateTable();
                } else {
                    const errorMessage = await response.text();
                    alert(`삭제 실패: ${errorMessage}`);
                }
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };
});
