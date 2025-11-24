// 1. 왼쪽 삼각형
// *
// **
// ***
// ****
// *****
function leftTriangle(lines) {
    for (let i = 1; i <= lines; i++) {
        console.log("*".repeat(i));
    }
}

function leftTriangleNested(lines) {
    for (let i = 1; i <= lines; i++) {
        let line = "";
        for (let j = 1; j <= i; j++) line += "*";
        console.log(line);
    }
}

// 2. 왼쪽 역삼각형
// *****
// ****
// ***
// **
// *
function leftReverseTriangle(lines) {
    for (let i = lines; i >= 1; i--) {
        console.log("*".repeat(i));
    }
}

function leftReverseTriangleNested(lines) {
    for (let i = lines; i >= 1; i--) {
        let line = "";
        for (let j = 1; j <= i; j++) line += "*";
        console.log(line);
    }
}

// 3. 오른쪽 삼각형
//     *
//    **
//   ***
//  ****
// *****
function rightTriangle(lines) {
    for (let i = 1; i <= lines; i++) {
        console.log(" ".repeat(lines - i) + "*".repeat(i));
    }
}

function rightTriangleNested(lines) {
    for (let i = 1; i <= lines; i++) {
        let line = "";
        for (let s = 1; s <= lines - i; s++) line += " ";
        for (let j = 1; j <= i; j++) line += "*";
        console.log(line);
    }
}

// 4. 오른쪽 역삼각형
// *****
//  ****
//   ***
//    **
//     *
function rightReverseTriangle(lines) {
    for (let i = lines; i >= 1; i--) {
        console.log(" ".repeat(lines - i) + "*".repeat(i));
    }
}

function rightReverseTriangleNested(lines) {
    for (let i = lines; i >= 1; i--) {
        let line = "";
        for (let s = 1; s <= lines - i; s++) line += " ";
        for (let j = 1; j <= i; j++) line += "*";
        console.log(line);
    }
}
