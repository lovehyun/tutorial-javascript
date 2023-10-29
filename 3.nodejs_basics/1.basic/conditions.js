// if 문
let isRaining = true;

if (isRaining) {
    console.log("우산을 가져가세요.");
} else {
    console.log("우산은 필요 없어요!");
}

// else if 문
let time = 14;

if (time < 12) {
    console.log("아침입니다.");
} else if (time < 18) {
    console.log("오후입니다.");
} else {
    console.log("저녁입니다.");
}

// switch 문
let day = "월요일";
let schedule;

switch (day) {
    case "월요일":
        schedule = "영어 수업";
        break;
    case "화요일":
        schedule = "수학 수업";
        break;
    case "수요일":
        schedule = "과학 수업";
        break;
    case "목요일":
        schedule = "역사 수업";
        break;
    case "금요일":
        schedule = "미술 수업";
        break;
    default:
        schedule = "주말!";
}

console.log(`오늘은 ${day}이고, 일정은 ${schedule}입니다.`);

// if 문과 동일한 구문
// let day = "월요일";
// let schedule;

// if else로 구현
if (day === "월요일") {
    schedule = "영어 수업";
} else if (day === "화요일") {
    schedule = "수학 수업";
} else if (day === "수요일") {
    schedule = "과학 수업";
} else if (day === "목요일") {
    schedule = "역사 수업";
} else if (day === "금요일") {
    schedule = "미술 수업";
} else {
    schedule = "주말!";
}

console.log(`오늘은 ${day}이고, 일정은 ${schedule}입니다.`);
