// 1. npm install axios webpack webpack-cli --save
// 2. webpack.config.js
// module.exports = {
//     entry: './index.js',
//     output: {
//       filename: 'bundle.js',
//     },
// };
// 3. npx webpack
// 4. <script src="bundle.js"></script>
//
// 또는, 외부 상위 html 파일에서 로딩...
// <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

// 사용자 정보를 받아오는 함수
export async function getUsers() {
    try {
        const response = await axios.get('/users');
        return response.data;
    } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
        throw error; // 에러를 다시 호출자에게 전파
    }
}

// 사용자 추가 함수
export async function addUser(name) {
    try {
        await axios.post('/users', { name });
    } catch (error) {
        const errorMessage = error.response ? error.response.data : '등록 실패';
        throw new Error(`등록 실패: ${errorMessage}`);
    }
}

// 사용자 정보를 업데이트하는 함수
export async function updateUser(userId, data) {
    try {
        await axios.put(`/users/${userId}`, data);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : '수정 실패';
        throw new Error(`수정 실패: ${errorMessage}`);
    }
}

// 사용자 정보를 삭제하는 함수
export async function deleteUserById(userId) {
    try {
        await axios.delete(`/users/${userId}`);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : '삭제 실패';
        throw new Error(`삭제 실패: ${errorMessage}`);
    }
}
