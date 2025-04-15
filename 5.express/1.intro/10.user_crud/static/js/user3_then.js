document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const userTable = document.getElementById('userTable');

    updateTable();

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();

        const name = username.value;
        if (!name) {
            alert('이름을 입력하세요.');
            return;
        }

        fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })
            .then(res => {
                if (!res.ok) throw new Error('등록 실패');
                return res.text();
            })
            .then(() => {
                alert('등록 성공');
                username.value = '';
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
                displayUsers(users);
            })
            .catch(error => {
                console.error('사용자 정보 불러오기 실패:', error);
            });
    }

    function displayUsers(users) {
        userTable.innerHTML = '';

        if (Object.keys(users).length === 0) {
            const messageRow = createTableRow('등록된 사용자가 없습니다.');
            userTable.appendChild(messageRow);
        } else {
            for (const key in users) {
                const row = createTableRow(`<strong>ID:</strong> ${key}, <strong>Name:</strong> ${users[key]}`);
                row.appendChild(createButton('수정', () => editUser(key)));
                row.appendChild(createButton('삭제', () => deleteUser(key)));
                userTable.appendChild(row);
            }
        }
    }

    // user를 list 로 구현한 경우
    // function displayUsers(users) {
    //     userTable.innerHTML = '';
    
    //     if (users.length === 0) {
    //         const messageRow = createTableRow('등록된 사용자가 없습니다.');
    //         userTable.appendChild(messageRow);
    //     } else {
    //         users.forEach(user => {
    //             const row = createTableRow(`<strong>ID:</strong> ${user.id}, <strong>Name:</strong> ${user.name}`);
    //             row.appendChild(createButton('수정', () => editUser(user.id)));
    //             row.appendChild(createButton('삭제', () => deleteUser(user.id)));
    //             userTable.appendChild(row);
    //         });
    //     }
    // }

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
        const newName = prompt('수정할 이름을 입력하세요.');
        if (newName !== null) {
            fetch(`/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName })
            })
                .then(res => {
                    if (!res.ok) throw new Error('수정 실패');
                    return res.text();
                })
                .then(() => {
                    alert('수정 성공');
                    return updateTable();
                })
                .catch(error => {
                    console.error('수정 중 오류 발생:', error);
                    alert('수정 중 오류가 발생했습니다.');
                });
        }
    }

    function deleteUser(userId) {
        const confirmDelete = confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            fetch(`/users/${userId}`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error('삭제 실패');
                    return res.text();
                })
                .then(() => {
                    alert('삭제 성공');
                    return updateTable();
                })
                .catch(error => {
                    console.error('삭제 중 오류 발생:', error);
                    alert('삭제 중 오류가 발생했습니다.');
                });
        }
    }
});
