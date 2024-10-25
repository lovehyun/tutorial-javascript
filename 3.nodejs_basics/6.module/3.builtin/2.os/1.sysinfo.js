// https://nodejs.org/docs/latest-v18.x/api/os.html
// 1. 운영 체제의 호스트 이름 가져오기 (Get Hostname of the Operating System)
const os = require('os');

// 호스트 이름 가져오기
const hostname = os.hostname();
console.log('호스트 이름:', hostname);


// 2. 운영 체제의 임시 폴더 경로 가져오기 (Get Temporary Directory Path of the Operating System)

// 임시 폴더 경로 가져오기
const tmpDir = os.tmpdir();
console.log('임시 폴더 경로:', tmpDir);

// 3. 운영 체제의 CPU 정보 가져오기 (Get CPU Information of the Operating System)

// CPU 정보 가져오기
const cpus = os.cpus();
console.log('CPU 정보:', cpus);


// 4. 운영 체제의 전체 메모리(RAM) 정보 가져오기 (Get Total Memory of the Operating System)

// 전체 메모리(RAM) 정보 가져오기
const totalMemory = os.totalmem();
console.log('전체 메모리:', totalMemory / (1024 * 1024 * 1024), 'GB');
