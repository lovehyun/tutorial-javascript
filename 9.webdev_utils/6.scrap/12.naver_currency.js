const axios = require('axios');

// 키연동방식
// https://api.exchangeratesapi.io/latest?base=USD

// 네이버 API 활용
const base_url = 'https://m.search.naver.com/p/csearch/content/qapirender.nhn?pkid=141&key=exchangeApiBasic&where=nexearch&q=%ED%95%98%EB%82%98%EC%9D%80%ED%96%89+%ED%99%98%EC%9C%A8%EC%A1%B0%ED%9A%8C&u6=standardUnit&u7=0';
const usd_url = base_url + '&u3=USD&u4=KRW&u2=1&u1=keb&u8=down&u5=info';
const jpy_url = base_url + '&u3=JPY&u4=KRW&u2=100&u1=keb&u8=down&u5=info';

axios.get(jpy_url).then(response => {
    console.log(response.data.itemList.to.price);
});
