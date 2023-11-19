// public/weather.js

document.addEventListener('DOMContentLoaded', () => {
    const weatherResult = document.getElementById('weatherResult');
    const getWeatherButton = document.getElementById('getWeatherButton');

    getWeatherButton.addEventListener('click', async () => {
        try {
            // 서버로부터 날씨 정보를 가져오기
            const response = await fetch('http://localhost:3000/weather?city=Seoul');
            const weatherData = await response.json();

            // 받아온 날씨 정보를 동적으로 HTML에 표시
            const htmlResult = `
                <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
                <p>Temperature: ${weatherData.main.temp} °C</p>
                <p>Weather: ${weatherData.weather[0].description}</p>
                `;

            weatherResult.innerHTML = htmlResult;
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
        }
    });
});
