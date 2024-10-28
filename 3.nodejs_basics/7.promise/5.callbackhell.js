function fetchUserData(username, callback) {
    console.log(`사용자 ${username} 데이터 가져오기`);
    const userData = { username: username, id: 1 };
    callback(userData);
}

function authenticateUser(userData, callback) {
    console.log(`사용자 ${userData.username} 인증`);
    const authenticatedData = { ...userData, authenticated: true };
    callback(authenticatedData);
}

function fetchUserProfile(authenticatedData, callback) {
    console.log(`사용자 ${authenticatedData.username} 프로필 가져오기`);
    const userProfile = { ...authenticatedData, profile: "Basic User Profile" };
    callback(userProfile);
}

// 콜백 헬 예제
fetchUserData("JohnDoe", (userData) => {
    authenticateUser(userData, (authenticatedData) => {
        fetchUserProfile(authenticatedData, (userProfile) => {
            console.log("최종 사용자 프로필:", userProfile);
        });
    });
});
