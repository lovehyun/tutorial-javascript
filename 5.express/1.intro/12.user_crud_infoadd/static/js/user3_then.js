document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const userTable = document.getElementById('userTable');

    let currentEditId = null;
    let currentDeleteUserId = null;

    updateTable();

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();

        const name = document.getElementById('username').value;
        const fullName = document.getElementById('fullname').value;
        const age = parseInt(document.getElementById('age').value);

        if (!name || !fullName || isNaN(age)) {
            alert('모든 정보를 올바르게 입력하세요.');
            return;
        }

        fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fullName, age })
        })
            .then(res => {
                if (!res.ok) throw new Error('등록 실패');
                return res.text();
            })
            .then(() => {
                alert('등록 성공');
                document.getElementById('username').value = '';
                document.getElementById('fullname').value = '';
                document.getElementById('age').value = '';
                return updateTable();
            })
            .catch(error => {
                console.error('등록 중 오류 발생:', error);
                alert('등록 중 오류가 발생했습니다.');
            });
    });

    function updateTable() {
        return fetch('/users')
            .then(res => {
                if (!res.ok) throw new Error('불러오기 실패');
                return res.json();
            })
            .then(users => {
                // 객체인 경우를 배열로 변환
                const userList = Array.isArray(users) ? users : Object.values(users);
                displayUsers(userList);
            })
            .catch(error => {
                console.error('사용자 정보 불러오기 실패:', error);
            });
    }

    function displayUsers(users) {
        userTable.innerHTML = '';

        if (users.length === 0) {
            const messageRow = createTableRow('등록된 사용자가 없습니다.');
            userTable.appendChild(messageRow);
        } else {
            users.forEach(user => {
                const row = createTableRow(
                    `<strong>ID:</strong> ${user.id}`,
                    `<strong>닉네임:</strong> ${user.name}`,
                    `<strong>이름:</strong> ${user.fullName}`,
                    `<strong>나이:</strong> ${user.age}`
                );
                row.appendChild(createButton('수정', () => editUser(user.id)));
                row.appendChild(createButton('삭제', () => deleteUser(user.id)));
                userTable.appendChild(row);
            });
        }
    }

    function createTableRow(...contents) {
        const row = document.createElement('div');
        row.innerHTML = contents.join(', ');
        return row;
    }

    function createButton(text, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', clickHandler);
        return button;
    }

    function editUser(userId) {
        fetch(`/users/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('사용자 정보 조회 실패');
                return res.json();
            })
            .then(user => {
                currentEditId = userId;
                document.getElementById('editName').value = user.name;
                document.getElementById('editFullName').value = user.fullName;
                document.getElementById('editAge').value = user.age;
                document.getElementById('editModal').style.display = 'block';
            })
            .catch(err => {
                console.error(err);
                alert('사용자 정보를 불러오지 못했습니다.');
            });
    }

    document.getElementById('saveEdit').addEventListener('click', () => {
        const name = document.getElementById('editName').value;
        const fullName = document.getElementById('editFullName').value;
        const age = parseInt(document.getElementById('editAge').value);

        fetch(`/users/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, fullName, age })
        }).then(res => {
            if (!res.ok) throw new Error('수정 실패');
            alert('수정 성공');

            // 수정 성공 후
            document.getElementById('editName').value = '';
            document.getElementById('editFullName').value = '';
            document.getElementById('editAge').value = '';
            document.getElementById('editModal').style.display = 'none';
            updateTable();
        }).catch(err => {
            alert('수정 실패');
        });
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
        currentEditId = null;
    });

    document.getElementById('confirmYes').addEventListener('click', () => {
        if (currentDeleteUserId === null) return;
    
        fetch(`/users/${currentDeleteUserId}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (!res.ok) throw new Error('삭제 실패');
                alert('삭제 성공');
                updateTable();
            })
            .catch(err => {
                alert('삭제 실패');
            })
            .finally(() => {
                document.getElementById('confirmModal').style.display = 'none';
                currentDeleteUserId = null;
            });
    });
    
    document.getElementById('confirmNo').addEventListener('click', () => {
        document.getElementById('confirmModal').style.display = 'none';
        currentDeleteUserId = null;
    });
    
    function deleteUser(userId) {
        currentDeleteUserId = userId;
        document.getElementById('confirmModal').style.display = 'block';
    }
});
