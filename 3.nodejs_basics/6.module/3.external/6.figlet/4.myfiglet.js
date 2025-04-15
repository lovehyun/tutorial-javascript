const asciiFont = {
    H: [
        '   ',
        '|_|',
        '| |',
    ],
    E: [
        ' __',
        '|__',
        '|__',
    ],
    L: [
        '   ',
        '|  ',
        '|__',
    ],
    O: [
        ' __ ',
        '|  |',
        '|__|',
    ],
};

function printAsciiArt(text) {
    const chars = text.toUpperCase().split('');

    for (let line = 0; line < 3; line++) {
        let output = '';
        for (const ch of chars) {
            output += (asciiFont[ch] ? asciiFont[ch][line] : '   ') + ' ';
        }
        console.log(output);
    }
}

printAsciiArt('hello');
