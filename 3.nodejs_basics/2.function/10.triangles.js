function leftTriangle() {
    let rows = 5;
    let currentRow = 1;
    while (currentRow <= rows) {
        let stars = "";
        let starCount = 1;
        while (starCount <= currentRow) {
            stars += "*";
            starCount++;
        }
        console.log(stars);
        currentRow++;
    }
}

function leftInvertTriangle() {
    let rows = 5;
    let currentRow = rows;
    while (currentRow >= 1) {
        let stars = "";
        
        // 별 추가
        let starCount = 1;
        while (starCount <= currentRow) {
            stars += "*";
            starCount++;
        }
        
        console.log(stars);
        currentRow--;
    }
}

function rightTriangle() {
    let rows = 5;
    let currentRow = 1;
    while (currentRow <= rows) {
        let spaces = "";
        let stars = "";
        
        // 공백을 먼저 추가
        let spaceCount = 1;
        while (spaceCount <= rows - currentRow) {
            spaces += " ";
            spaceCount++;
        }
        
        // 별을 추가
        let starCount = 1;
        while (starCount <= currentRow) {
            stars += "*";
            starCount++;
        }
        
        // 공백과 별을 함께 출력
        console.log(spaces + stars);
        currentRow++;
    }
    
}

function rightInvertTriangle() {
    let rows = 5;
    let currentRow = rows;
    while (currentRow >= 1) {
        let spaces = "";
        let stars = "";
        
        // 공백 추가
        let spaceCount = 1;
        while (spaceCount <= rows - currentRow) {
            spaces += " ";
            spaceCount++;
        }
        
        // 별 추가
        let starCount = 1;
        while (starCount <= currentRow) {
            stars += "*";
            starCount++;
        }
        
        console.log(spaces + stars);
        currentRow--;
    }
}

function doublesideTriangle() {
    let rows = 5;
    let currentRow = 1;
    while (currentRow <= rows) {
        let spaces = "";
        let stars = "";
        
        // 공백 추가 (왼쪽에 배치)
        let spaceCount = 1;
        while (spaceCount <= rows - currentRow) {
            spaces += " ";
            spaceCount++;
        }
        
        // 별 추가
        let starCount = 1;
        while (starCount <= 2 * currentRow - 1) {
            stars += "*";
            starCount++;
        }
        
        // 공백과 별을 함께 출력
        console.log(spaces + stars);
        currentRow++;
    }    
}

function doublesideInvertTriangle() {
    let rows = 5;
    let currentRow = rows;
    while (currentRow >= 1) {
        let spaces = "";
        let stars = "";
        
        // 공백 추가 (왼쪽에 배치)
        let spaceCount = 1;
        while (spaceCount <= rows - currentRow) {
            spaces += " ";
            spaceCount++;
        }
        
        // 별 추가
        let starCount = 1;
        while (starCount <= 2 * currentRow - 1) {
            stars += "*";
            starCount++;
        }
        
        // 공백과 별을 함께 출력
        console.log(spaces + stars);
        currentRow--;
    }
}

leftTriangle();
console.log();
leftInvertTriangle();
console.log();
rightTriangle();
console.log();
rightInvertTriangle();
console.log();
doublesideTriangle();
console.log();
doublesideInvertTriangle();
console.log();
