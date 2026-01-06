// 이 코드에서 REACT_APP_API_URL은 환경 변수로 설정되어 있어, 
// 필요한 경우 .env 파일을 프로젝트 루트 디렉토리에 만들어 사용할 수 있습니다. 
// 만약 이 변수가 설정되어 있지 않다면 기본값으로 'http://localhost:5000'을 사용합니다.
// 리엑트 앱에서는 별도의 dotenv 설치는 불필요하며 package.json 과 같은 레벨에 .env 파일을 위치하고 모든 환경변수를 REACT_APP_ 으로 시작해야 함.

import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // 기본값은 로컬 서버의 주소와 포트
    timeout: 10000, // 타임아웃 설정
    headers: {
        'Content-Type': 'application/json',
        // 추가적인 헤더 설정이 필요한 경우 여기에 추가
    },
});

export default instance;
