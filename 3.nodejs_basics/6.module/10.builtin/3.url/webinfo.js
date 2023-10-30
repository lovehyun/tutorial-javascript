// 1. URL 파싱 (Parse URL)
const url = require('url');

const myURL = 'https://www.example.com/path?query=value';

// URL 파싱
const parsedURL = url.parse(myURL, true);
console.log('파싱된 URL:', parsedURL);
console.log('호스트:', parsedURL.host);
console.log('경로:', parsedURL.pathname);
console.log('쿼리:', parsedURL.query);


// 2. URL 조립 (URL Assemble)
const myURL2 = {
  protocol: 'https',
  hostname: 'www.example.com',
  pathname: '/path',
  query: {
    key: 'value'
  }
};

// URL 조립
const assembledURL = url.format(myURL2);
console.log('조립된 URL:', assembledURL);


// 3. URL 해결 (URL Resolve)
const baseURL = 'https://www.example.com/';
const relativePath = 'images/logo.png';

// URL 해결
const resolvedURL = url.resolve(baseURL, relativePath);
console.log('해결된 URL:', resolvedURL);
