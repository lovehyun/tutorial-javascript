// Promise를 반환하는 함수들로 유지
function fetchUserData(username) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${username} 데이터 가져오기`);
        const userData = { username: username, id: 1 };
        resolve(userData);
    });
}

function authenticateUser(userData) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${userData.username} 인증`);
        const authenticatedData = { ...userData, authenticated: true };
        resolve(authenticatedData);
    });
}

function fetchUserProfile(authenticatedData) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${authenticatedData.username} 프로필 가져오기`);
        const userProfile = { ...authenticatedData, profile: "Basic User Profile" };
        resolve(userProfile);
    });
}

// async/await 함수 정의
async function processUser() {
    try {
        const userData = await fetchUserData("JohnDoe");
        const authenticatedData = await authenticateUser(userData);
        const userProfile = await fetchUserProfile(authenticatedData);
        console.log("최종 사용자 프로필:", userProfile);
    } catch (error) {
        console.error("오류 발생:", error);
    }
}

// 함수 호출
processUser();
