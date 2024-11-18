const express = require('express');
const nunjucks = require('nunjucks');
const { getSeoulPopulationData } = require('./data'); // data.js 파일에서 데이터 가져오기

const app = express();
const port = 3000;

// Nunjucks 설정
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// View Engine 설정
app.set('view engine', 'html');

app.get('/', (req, res) => {
    const seoulData = getSeoulPopulationData();
    res.render('population_map', { seoulData: JSON.stringify(seoulData) });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
