const fs = require('fs');
const path = require('path');

const directoryPath = "./";
// const directoryPath = "../";

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.log('읽기 오류', err);
        return;
    }

    // console.log(files);
    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        console.log('파일: ', filePath);
    })
});
