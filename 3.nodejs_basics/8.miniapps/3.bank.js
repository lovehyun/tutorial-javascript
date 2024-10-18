const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let balance = 0;

function atmMenu() {
    console.log('\nATM 메뉴:');
    console.log('1. 잔액 확인');
    console.log('2. 입금');
    console.log('3. 인출');
    console.log('4. 종료');

    rl.question('원하는 작업을 선택하세요: ', (answer) => {
        const choice = parseInt(answer);

        switch (choice) {
            case 1:
                console.log(`=> 현재 잔액은 ${balance}원입니다.`);
                atmMenu();
                break;
            case 2:
                rl.question('입금할 금액을 입력하세요: ', (depositAnswer) => {
                    const depositAmount = parseInt(depositAnswer);
                    balance += depositAmount;
                    console.log(`=> ${depositAmount}원이 입금되었습니다.`);
                    atmMenu();
                });
                break;
            case 3:
                rl.question('인출할 금액을 입력하세요: ', (withdrawAnswer) => {
                    const withdrawAmount = parseInt(withdrawAnswer);
                    if (withdrawAmount > balance) {
                        console.log('=> 잔액이 부족합니다.');
                    } else {
                        balance -= withdrawAmount;
                        console.log(`=> ${withdrawAmount}원이 인출되었습니다.`);
                    }
                    atmMenu();
                });
                break;
            case 4:
                console.log('=> ATM을 종료합니다.');
                rl.close();
                break;
            default:
                console.log('=> 잘못된 선택입니다.');
                atmMenu();
                break;
        }
    });
}

atmMenu();
