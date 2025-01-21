import axios from 'axios';

const baseURL = 'http://localhost:3000/users';

async function runTests() {
    try {
        // CREATE: 사용자 추가
        console.log('Testing CREATE (POST /users)...');
        const createResponse1 = await axios.post(baseURL, {
            name: 'Alice',
            email: 'alice@example.com',
        });
        console.log('Created User 1:', createResponse1.data);

        const createResponse2 = await axios.post(baseURL, {
            name: 'Bob',
            email: 'bob@example.com',
        });
        console.log('Created User 2:', createResponse2.data);

        // READ: 사용자 목록 조회
        console.log('\nTesting READ (GET /users)...');
        const listResponse = await axios.get(baseURL);
        console.log('User List:', listResponse.data);

        // UPDATE: 사용자 정보 수정 (예제 API에는 없지만, 작성 가능)
        // (여기서는 생략하지만 필요하면 구현)

        // DELETE: 사용자 삭제
        console.log('\nTesting DELETE (DELETE /users/:id)...');
        const userIdToDelete = createResponse1.data.id;
        await axios.delete(`${baseURL}/${userIdToDelete}`);
        console.log(`Deleted User with ID: ${userIdToDelete}`);

        // READ: 사용자 목록 재확인
        console.log('\nTesting READ after DELETE (GET /users)...');
        const listAfterDeleteResponse = await axios.get(baseURL);
        console.log('Updated User List:', listAfterDeleteResponse.data);

        // DELETE ALL: 모든 사용자 삭제
        console.log('\nTesting DELETE ALL (DELETE /users)...');
        await axios.delete(baseURL);
        console.log('All users deleted.');

        // READ: 확인용 조회
        console.log('\nTesting READ after cleanup (GET /users)...');
        const emptyListResponse = await axios.get(baseURL);
        console.log('Final User List:', emptyListResponse.data);

        console.log('\nAll tests completed successfully!');
    } catch (error: any) {
        console.error('Error during testing:', error.response?.data || error.message);
    }
}

runTests();
