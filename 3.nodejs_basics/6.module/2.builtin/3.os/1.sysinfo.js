// https://nodejs.org/docs/latest-v18.x/api/os.html
const os = require('os');

// 1. 운영 체제의 호스트 이름 가져오기 (Get Hostname of the Operating System)
const hostname = os.hostname();
console.log('호스트 이름:', hostname);


// 2. 운영 체제의 임시 폴더 경로 가져오기 (Get Temporary Directory Path of the Operating System)
const tmpDir = os.tmpdir();
console.log('임시 폴더 경로:', tmpDir);


// 3. 운영 체제의 CPU 정보 가져오기 (Get CPU Information of the Operating System)
const cpus = os.cpus();
console.log('CPU 정보:', cpus);


// 4. 운영 체제의 전체 메모리(RAM) 정보 가져오기 (Get Total Memory of the Operating System)
const totalMemory = os.totalmem();
console.log('전체 메모리:', totalMemory / (1024 * 1024 * 1024), 'GB');


// 5. 운영 체제의 사용 가능한 메모리(RAM) 정보 가져오기 (Get Free Memory of the Operating System)
const freeMemory = os.freemem();
console.log('사용 가능한 메모리:', freeMemory / (1024 * 1024 * 1024), 'GB');


// 6. 운영 체제의 플랫폼 정보 가져오기 (Get Platform Information of the Operating System)
// 운영 체제의 플랫폼(예: linux, win32, darwin)을 알아낼 수 있습니다.
const platform = os.platform();
console.log('플랫폼:', platform);

const osVersion = os.version();
console.log('운영 체제 버전:', osVersion);

const osRelease = os.release();
console.log('운영 체제 릴리스 버전:', osRelease);
