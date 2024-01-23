const base64UrlEncode = (str) => {
    let base64 = Buffer.from(str).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (str) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return Buffer.from(str, 'base64').toString('utf-8');
};

// 예제 JWT (헤더, 페이로드, 서명)
const exampleHeader = '{"alg": "HS256","typ": "JWT"}';
const examplePayload = '{"clientId": "uniqueClientId"}';
const exampleSignature = 'yourSecretKey';

// Base64로 인코딩
const encodedHeader = base64UrlEncode(exampleHeader);
const encodedPayload = base64UrlEncode(examplePayload);

// 새로운 JWT 생성 (서명은 미포함)
const tamperedJWT = `${encodedHeader}.${encodedPayload}`;

console.log('Original JWT:', tamperedJWT);

// 새로운 JWT의 페이로드 디코딩
const decodedPayload = base64UrlDecode(encodedPayload);
console.log('Decoded Payload:', decodedPayload);
