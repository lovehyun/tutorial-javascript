// 공백 추가 함수
function addSpaces(spaceCount) {
    let spaces = "";
    while (spaceCount > 0) {
        spaces += " ";
        spaceCount--;
    }
    return spaces;
}

// 별 추가 함수
function addStars(starCount) {
    let stars = "";
    while (starCount > 0) {
        stars += "*";
        starCount--;
    }
    return stars;
}

function leftTriangle(rows) {
    let currentRow = 1;
    while (currentRow <= rows) {
        console.log(addStars(currentRow));
        currentRow++;
    }
}

function leftInvertTriangle(rows) {
    let currentRow = rows;
    while (currentRow >= 1) {
        console.log(addStars(currentRow));
        currentRow--;
    }
}

function rightTriangle(rows) {
    let currentRow = 1;
    while (currentRow <= rows) {
        let spaces = addSpaces(rows - currentRow);
        let stars = addStars(currentRow);
        console.log(spaces + stars);
        currentRow++;
    }
}

function rightInvertTriangle(rows) {
    let currentRow = rows;
    while (currentRow >= 1) {
        let spaces = addSpaces(rows - currentRow);
        let stars = addStars(currentRow);
        console.log(spaces + stars);
        currentRow--;
    }
}

function doublesideTriangle(rows) {
    let currentRow = 1;
    while (currentRow <= rows) {
        let spaces = addSpaces(rows - currentRow);
        let stars = addStars(2 * currentRow - 1);
        console.log(spaces + stars);
        currentRow++;
    }
}

function doublesideInvertTriangle(rows) {
    let currentRow = rows;
    while (currentRow >= 1) {
        let spaces = addSpaces(rows - currentRow);
        let stars = addStars(2 * currentRow - 1);
        console.log(spaces + stars);
        currentRow--;
    }
}

// 함수 호출 예시
const rows = 5;
leftTriangle(rows);
console.log();
leftInvertTriangle(rows);
console.log();
rightTriangle(rows);
console.log();
rightInvertTriangle(rows);
console.log();
doublesideTriangle(rows);
console.log();
doublesideInvertTriangle(rows);
console.log();
