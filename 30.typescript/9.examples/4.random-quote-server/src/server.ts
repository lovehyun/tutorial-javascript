import express from 'express';
import morgan from 'morgan';
import { getRandomQuote } from './quote'; // quote 모듈에서 가져오기

const app = express();
const PORT = 3000;

// const quotes: string[] = [
//     'The greatest glory in living lies not in never falling, but in rising every time we fall.',
//     'The way to get started is to quit talking and begin doing.',
//     "Life is what happens when you're busy making other plans.",
//     'Your time is limited, so don’t waste it living someone else’s life.',
//     'If life were predictable it would cease to be life, and be without flavor.',
// ];

// function getRandomQuote(): string {
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     return quotes[randomIndex];
// }

// morgan 미들웨어 추가 (dev 모드)
app.use(morgan('dev'));

app.use(express.static('public'));

app.get('/api/quote', (req, res) => {
    res.json({ quote: getRandomQuote() });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
