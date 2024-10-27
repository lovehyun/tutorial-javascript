const url = require('url');

const myURL = 'https://www.example.com/api/path?query=value';

// 1. URL 파싱 (Parse URL)
// URL 파싱 #1
const myURLObj = new URL(myURL);
console.log('호스트:', myURLObj.host);
console.log('경로:', myURLObj.pathname);
console.log('쿼리:', myURLObj.search);

// URL 파싱 #2
const parsedURL = url.parse(myURL);
console.log('파싱된 URL:', parsedURL);
console.log('호스트:', parsedURL.host);
console.log('경로:', parsedURL.pathname);
console.log('쿼리1:', parsedURL.search);
console.log('쿼리2:', parsedURL.query);


// 2. URL 조립 (URL Assemble)
const myURL2 = {
  protocol: 'https',
  hostname: 'www.example.com',
  pathname: '/path',
  query: {
    key: 'value'
  }
};

const assembledURL = url.format(myURL2);
console.log('조립된 URL:', assembledURL);


// 3. URL 조립 #2
const baseURL = 'https://www.example.com/';
const relativePath = 'images/logo.png';

const resolvedURL = url.resolve(baseURL, relativePath);
console.log('해결된 URL:', resolvedURL);
