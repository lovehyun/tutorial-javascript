function generateRandomNumber() {
    return new Promise((resolve, reject) => {
        console.log("랜덤 숫자를 생성 중...");

        setTimeout(() => {
            const randomNumber = Math.random();
            console.log("생성된 숫자:", randomNumber);

            if (randomNumber >= 0.5) {
                resolve(`성공! 숫자 ${randomNumber}가 0.5 이상입니다.`);
            } else {
                reject(`실패! 숫자 ${randomNumber}가 0.5 미만입니다.`);
            }
        }, 2000);
    });
}

async function checkRandomNumber() {
    try {
        const message = await generateRandomNumber();
        console.log("이행됨:", message);
    } catch (error) {
        console.error("실패:", error);
    }
}

// async 함수 호출
checkRandomNumber();
