// 공백 추가 함수
function addSpaces(count) {
    // return " ".repeat(count);
    let spaces = "";
    for (let i = 1; i <= count; i++) {
        spaces += " ";
    }
    return spaces;
}

// 별 추가 함수
function addStars(count) {
    // return "*".repeat(count);
    let stars = "";
    for (let i = 1; i <= count; i++) {
        stars += "*";
    }
    return stars;
}

// 하트 그리기 함수
function drawHeart(rows) {
    let currentRow = 1;
    let middleSpacesCount = rows * 2 - 1; // 중간 공백을 처음엔 크게 설정

    // 하트의 윗부분
    while (currentRow <= rows) {
        let spaces = addSpaces(rows - currentRow + 1);
        let stars = addStars(currentRow * 2 - 1);
        let middleSpaces = addSpaces(middleSpacesCount);
        middleSpacesCount -= 2; // 중간 공백이 줄어듦
        console.log(spaces + stars + middleSpaces + stars);
        currentRow++;
    }

    // 하트의 아랫부분 (V자 모양)
    let bottomRow = rows * 2 + 1;
    while (bottomRow >= 1) {
        let spaces = addSpaces((rows * 2 + 1) - bottomRow);
        let stars = addStars(bottomRow * 2 - 1);
        console.log(spaces + stars);
        bottomRow -= 2;
    }
}

// 하트 출력
drawHeart(5);
