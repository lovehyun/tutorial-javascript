const axios = require('axios');

const base_url = 'https://m.search.naver.com/p/csearch/content/qapirender.nhn';

// 환율 정보를 호출하는 함수
function getExchangeRate(params) {
    return axios.get(base_url, { params })
        .then(response => {
            // raw-data 확인
            console.log(response.data);
            
            const country = response.data?.country;
            if (country && country.length === 2) {
                const exchangeRate = country[1].value.replace(',', '');
                return parseFloat(exchangeRate).toFixed(2);
            } else {
                throw new Error('Exchange rate not available.');
            }
        })
        .catch(error => {
            console.error('Error fetching exchange rate:', error.message);
            throw error;
        });
}

const common_params = { key: 'calculator', pkid: '141', q: '환율', where: 'm', u1: 'keb' }

// JPY로 변환
const jpy_params = { ...common_params, u3: 'JPY', u4: 'KRW', u2: 100 };
getExchangeRate(jpy_params)
    .then(jpyRate => {
        console.log('JPY to KRW exchange rate:', jpyRate);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });

// USD로 변환
const usd_params = { ...common_params, u3: 'USD', u4: 'KRW', u2: 1 };
getExchangeRate(usd_params)
    .then(usdRate => {
        console.log('USD to KRW exchange rate:', usdRate);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
