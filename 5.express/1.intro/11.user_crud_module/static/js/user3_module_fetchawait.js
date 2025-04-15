// --------------------------------------------------------
// 사용자 처리 - 외부 fetch 
// --------------------------------------------------------

// 사용자 정보를 받아오는 함수
export async function getUsers() {
    try {
        const response = await fetch('/users');
        if (!response.ok) {
            throw new Error('사용자 정보 불러오기 실패');
        }
        return response.json();
    } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
        throw error; // 에러를 다시 호출자에게 전파
    }
}

// 사용자 추가 함수
export async function addUser(name) {
    const response = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`등록 실패: ${errorMessage}`);
    }
}

// 사용자 정보를 업데이트하는 함수
export async function updateUser(userId, data) {
    const response = await fetch(`/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`수정 실패: ${errorMessage}`);
    }
}

// 사용자 정보를 삭제하는 함수
export async function deleteUserById(userId) {
    const response = await fetch(`/users/${userId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`삭제 실패: ${errorMessage}`);
    }
}
