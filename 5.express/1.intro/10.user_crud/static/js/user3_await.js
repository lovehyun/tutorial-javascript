document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const username = document.getElementById('username');
    const userTable = document.getElementById('userTable');

    updateTable();

    form.addEventListener('submit', async function (ev) {
        ev.preventDefault();

        const name = username.value;
        if (!name) {
            alert('이름을 입력하세요.');
            return;
        }

        try {
            const res = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });

            if (!res.ok) throw new Error('등록 실패');
            await res.text();

            alert('등록 성공');
            username.value = '';
            await updateTable();
        } catch (error) {
            console.error('등록 중 오류 발생:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    });

    async function updateTable() {
        try {
            const res = await fetch('/users');
            if (!res.ok) throw new Error('불러오기 실패');
            const users = await res.json();
            displayUsers(users);
        } catch (error) {
            console.error('사용자 정보 불러오기 실패:', error);
        }
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

    async function editUser(userId) {
        const newName = prompt('수정할 이름을 입력하세요.');
        if (newName !== null) {
            try {
                const res = await fetch(`/users/${userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });

                if (!res.ok) throw new Error('수정 실패');
                await res.text();

                alert('수정 성공');
                await updateTable();
            } catch (error) {
                console.error('수정 중 오류 발생:', error);
                alert('수정 중 오류가 발생했습니다.');
            }
        }
    }

    async function deleteUser(userId) {
        const confirmDelete = confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                const res = await fetch(`/users/${userId}`, {
                    method: 'DELETE'
                });

                if (!res.ok) throw new Error('삭제 실패');
                await res.text(); // 실제로 응답 바디 없으면 이 줄 생략 가능

                alert('삭제 성공');
                await updateTable();
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    }
});
