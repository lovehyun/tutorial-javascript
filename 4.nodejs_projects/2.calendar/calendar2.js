class Calendar {
    constructor(year, month) {
        this.year = year;
        this.month = month;
    }

    getDaysInMonth() {
        return new Date(this.year, this.month, 0).getDate();
    }

    getFirstDayOfWeek() {
        return new Date(this.year, this.month - 1, 1).getDay();
    }

    generate() {
        const daysInMonth = this.getDaysInMonth();
        const firstDay = this.getFirstDayOfWeek();

        const days = ['일', '월', '화', '수', '목', '금', '토'];

        console.log(`${this.year}년 ${this.month}월`);
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
}

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;

const calendar = new Calendar(currentYear, currentMonth);
calendar.generate();
