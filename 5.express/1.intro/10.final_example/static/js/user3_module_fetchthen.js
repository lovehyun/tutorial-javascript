// --------------------------------------------------------
// 사용자 처리 - 외부 fetch 
// --------------------------------------------------------

// 사용자 정보를 받아오는 함수
export function getUsers() {
    return fetch('/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('사용자 정보 불러오기 실패');
            }
            return response.json();
        })
        .catch(error => {
            console.error('사용자 정보 불러오기 실패:', error);
            throw error; // 에러를 다시 호출자에게 전파
        });
}

// 사용자 추가 함수
export function addUser(name) {
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
    })
    .catch(error => {
        console.error('등록 중 오류 발생:', error);
        throw error;
    });
}

// 사용자 정보를 업데이트하는 함수
export function updateUser(userId, data) {
    return fetch(`/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(`수정 실패: ${errorMessage}`);
            });
        }
    })
    .catch(error => {
        console.error('수정 중 오류 발생:', error);
        throw error;
    });
}

// 사용자 정보를 삭제하는 함수
export function deleteUserById(userId) {
    return fetch(`/user/${userId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorMessage => {
                throw new Error(`삭제 실패: ${errorMessage}`);
            });
        }
    })
    .catch(error => {
        console.error('삭제 중 오류 발생:', error);
        throw error;
    });
}
