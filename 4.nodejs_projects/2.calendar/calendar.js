function generateCalendar(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 전체 일 수 계산
    const firstDay = new Date(year, month - 1, 1).getDay(); // 해당 월의 첫째 날 요일 계산

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    console.log(`${year}년 ${month}월`);
    console.log('일 월 화 수 목 금 토');

    let day = 1;

    for (let i = 0; i < 6; i++) {
        let line = '';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                line += '   ';
            } else if (day > daysInMonth) {
                break;
            } else {
                line += (day < 10 ? ' ' : '') + day + ' ';
                day++;
            }
        }
        console.log(line);
    }
}

// 현재 년도와 월을 기준으로 달력 출력
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

generateCalendar(currentYear, currentMonth);
