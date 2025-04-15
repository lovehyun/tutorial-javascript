// v4 까지만 CommonJS 방식 지원, 이후로는 ESM만 지원
// npm uninstall chalk
// npm install chalk@4

// const chalk = require('chalk');
import chalk from 'chalk';

console.log(chalk.green("성공!"));              // 초록색 글씨
console.log(chalk.red.bold("에러 발생"));       // 굵은 빨간 글씨
console.log(chalk.bgBlue.white("정보"));        // 파란 배경 + 흰 글씨
console.log(chalk.yellow.underline("경고"));    // 노란 밑줄
