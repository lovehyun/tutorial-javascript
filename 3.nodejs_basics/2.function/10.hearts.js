let rows = 3;

// 하트의 윗부분
let currentRow = 1;
let middleSpacesCount = 4; // 중간 공백을 처음엔 크게 설정

while (currentRow <= rows) {
    let spaces = " ";
    let stars = "";

    // 첫 번째 반원 공백
    let spaceCount = 1;
    while (spaceCount <= rows - currentRow) {
        spaces += " ";
        spaceCount++;
    }

    // 첫 번째 반원 별
    let starCount = 1;
    while (starCount <= currentRow * 2 - 1) {
        stars += "*";
        starCount++;
    }

    // 중간 공백을 점차 줄여감
    let middleSpaces = " ";
    let middleSpace = 1;
    while (middleSpace <= middleSpacesCount) {
        middleSpaces += " ";
        middleSpace++;
    }
    middleSpacesCount -= 2; // 내려갈수록 중간 공백이 줄어듦

    // 두 번째 반원의 별
    let secondStars = stars;

    console.log(spaces + stars + middleSpaces + secondStars);

    currentRow++;
}

// 하트의 아랫부분 (V자 모양)
let bottomRow = rows * 2 + 1;
while (bottomRow >= 1) {
    let spaces = "";
    let stars = "";

    // 공백 추가
    let spaceCount = 1;
    while (spaceCount <= (rows * 2 + 1) - bottomRow) {
        spaces += " ";
        spaceCount++;
    }

    // 별 추가
    let starCount = 1;
    while (starCount <= bottomRow * 2 - 1) {
        stars += "*";
        starCount++;
    }

    console.log(spaces + stars);

    bottomRow -= 2;
}
