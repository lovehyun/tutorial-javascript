// combined: Apache의 combined log format과 유사한 형식. :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
// common: Apache의 common log format과 유사한 형식. :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
// short: 로그 형식이 간단한 형태. :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
// tiny: 매우 간단한 형태. :method :url :status :res[content-length] - :response-time ms
// dev: 개발 시 디버깅 용도. 개행 문자가 없는 컬러 출력. :method :url :status :response-time ms - :res[content-length]
// custom format: 사용자가 직접 로그 형식을 정의할 수 있습니다. 예를 들면 :method :url :status :res[content-length] - :response-time ms과 같이 사용할 수 있습니다.

const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;

// morgan 미들웨어를 사용하여 로깅 설정

// "combined" 형식으로 로깅
app.use(morgan('combined'));

// "dev" 형식으로 로깅
app.use(morgan('dev'));

// 사용자 정의 로그 형식
app.use(morgan(':method :url :status :response-time ms'));

// 사용자 정의 로그 포맷 커스터마이징
app.use(morgan(':method :url :status :response-time ms', {
    format: '[:date[iso]] :method :url :status :response-time ms'
}));


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
