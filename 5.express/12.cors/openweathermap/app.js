const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS 미들웨어를 사용하여 모든 출처의 요청을 허용
app.use(cors());

// 정적 파일 제공을 위해 public 폴더 설정
app.use(express.static('public'));

// 날씨 정보를 가져오는 라우트
app.get('/weather', async (req, res) => {
    try {
        // OpenWeatherMap API에서 날씨 정보 가져오기
        const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
        const city = req.query.city || 'Seoul';
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        const response = await axios.get(apiUrl);
        const weatherData = response.data;

        // 클라이언트에 날씨 정보 전송
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
