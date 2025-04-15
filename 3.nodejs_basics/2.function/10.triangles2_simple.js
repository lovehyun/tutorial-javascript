function leftTriangle(rows = 5) {
    for (let i = 1; i <= rows; i++) {
        let stars = "";
        for (let j = 1; j <= i; j++) {
            stars += "*";
        }
        console.log(stars);
    }
}

function leftTriangle_simple(rows = 5) {
    for (let i = 1; i <= rows; i++) {
        console.log("*".repeat(i));
    }
}

function leftInvertTriangle_simple(rows = 5) {
    for (let i = rows; i >= 1; i--) {
        console.log("*".repeat(i));
    }
}

function rightTriangle_simple(rows = 5) {
    for (let i = 1; i <= rows; i++) {
        console.log(" ".repeat(rows - i) + "*".repeat(i));
    }
}

function rightInvertTriangle_simple(rows = 5) {
    for (let i = rows; i >= 1; i--) {
        console.log(" ".repeat(rows - i) + "*".repeat(i));
    }
}

function doublesideTriangle_simple(rows = 5) {
    for (let i = 1; i <= rows; i++) {
        console.log(" ".repeat(rows - i) + "*".repeat(2 * i - 1));
    }
}

function doublesideInvertTriangle_simple(rows = 5) {
    for (let i = rows; i >= 1; i--) {
        console.log(" ".repeat(rows - i) + "*".repeat(2 * i - 1));
    }
}

leftTriangle_simple();
console.log();
leftInvertTriangle_simple();
console.log();
rightTriangle_simple();
console.log();
rightInvertTriangle_simple();
console.log();
doublesideTriangle_simple();
console.log();
doublesideInvertTriangle_simple();
console.log();
