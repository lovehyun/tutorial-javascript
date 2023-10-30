const path = require('path');

// 파일 경로 조인 (Joining file paths)
const filePath = path.join('/Users/username/documents', 'file.txt');
console.log('파일 경로:', filePath);

// 파일 확장자명 반환 (Return file extension)
const extName = path.extname(filePath);
console.log('파일 확장자:', extName);

// 파일의 디렉토리명 반환 (Return directory name of a file path)
const dirName = path.dirname(filePath);
console.log('파일이 속한 디렉토리:', dirName);

// 파일명만 반환 (Return the file name)
const baseName = path.basename(filePath);
console.log('파일명:', baseName);
