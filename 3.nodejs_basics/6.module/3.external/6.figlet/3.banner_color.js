import chalk from 'chalk';
import figlet from 'figlet';

figlet('Welcome!', (err, data) => {
    if (err) {
        console.error('figlet 에러:', err);
        return;
    }

    // 컬러 입혀서 출력
    console.log(chalk.cyan(data)); // 원하는 색상으로 변경 가능

    // 노란 배경 + 초록 텍스트로 출력
    console.log(chalk.bgYellow.green(data));
});
