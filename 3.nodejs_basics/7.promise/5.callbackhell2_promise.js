// Promise를 반환하는 함수들로 변경
function fetchUserData(username) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${username} 데이터 가져오기`);
        const userData = { username: username, id: 1 };
        resolve(userData); // 성공적으로 데이터를 가져온 경우
    });
}

function authenticateUser(userData) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${userData.username} 인증`);
        const authenticatedData = { ...userData, authenticated: true };
        resolve(authenticatedData); // 인증이 성공적으로 완료된 경우
    });
}

function fetchUserProfile(authenticatedData) {
    return new Promise((resolve, reject) => {
        console.log(`사용자 ${authenticatedData.username} 프로필 가져오기`);
        const userProfile = { ...authenticatedData, profile: "Basic User Profile" };
        resolve(userProfile); // 프로필 가져오기 완료
    });
}

// Promise 체인을 사용한 호출
fetchUserData("JohnDoe")
    .then((userData) => authenticateUser(userData))
    .then((authenticatedData) => fetchUserProfile(authenticatedData))
    .then((userProfile) => {
        console.log("최종 사용자 프로필:", userProfile);
    })
    .catch((error) => {
        console.error("오류 발생:", error);
    });
