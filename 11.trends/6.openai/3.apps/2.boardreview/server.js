const express = require('express');
const morgan = require('morgan');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(morgan('dev'));

// In-memory storage for reviews
let reviews = [];

// Add a review
app.post('/api/reviews', (req, res) => {
    const { rating, opinion } = req.body;

    if (!rating || !opinion) {
        return res.status(400).json({ error: 'Rating and opinion are required' });
    }

    reviews.push({ rating, opinion });
    res.status(201).json({ message: 'Review added successfully' });
});

// Get all reviews
app.get('/api/reviews', (req, res) => {
    res.json({ reviews });
});

// Get AI summary
app.get('/api/ai-summary', async (req, res) => {
    if (reviews.length === 0) {
        return res.json({ summary: '리뷰가 없습니다.', averageRating: 0 });
    }

    const averageRating =
        reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;

    const reviewsText = reviews
        .map((review) => `별점: ${review.rating}, 내용: ${review.opinion}`)
        .join('\n');

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // 사용할 모델 선택 gpt-4o-mini
            messages: [
                // system prompt가 없으면 일반적인 지식을 바탕으로 응답함. (Optional)
                // { role: 'system', content: '당신은 리뷰를 한글로 요약하는 전문가입니다. 간결하고 명확한 표현을 사용하세요.' },
                {
                    role: 'user',
                    content: `다음 리뷰 목록을 기반으로 간결한 한글 요약을 작성하세요:\n\n${reviewsText}`,
                },
            ],
        });

        const summary = response.choices[0].message.content.trim();
        res.json({ summary, averageRating });
    } catch (error) {
        console.error('Error generating AI summary:', error);
        res.status(500).json({ error: 'Failed to generate AI summary' });
    }
});

// Serve frontend
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
