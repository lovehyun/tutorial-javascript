const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/api/search-lyrics', async (req, res) => {
    const query = req.query.query;

    try {
        const response = await axios.get('https://m.search.naver.com/p/csearch/content/qapirender.nhn', {
            params: {
                where: 'm',
                key: 'LyricsSearchResult',
                pkid: '519',
                u1: 1,
                u2: 3,
                u3: '0',
                u4: '1',
                q: '가사검색 ' + query,
            },
        });

        const currentHTML = response.data.current.html;
        const nextHTML = response.data.next.html;

        const currentResults = processLyricsInfo(currentHTML);
        const nextResults = processLyricsInfo(nextHTML);

        const allResults = currentResults.concat(nextResults);

        res.json(allResults);
    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const processLyricsInfo = (html) => {
    const $ = cheerio.load(html);

    const results = [];

    $('li[role="tab"]').each((index, element) => {
        const title = $(element).find('.music_title a').text().trim();
        const artist = $(element).find('.music_detail a').eq(0).text().trim();
        const link = $(element).find('.music_title a').attr('href');
        const lyrics = $(element).find('.lyrics_bx .lyrics_text').text().trim();

        results.push({
            title,
            artist,
            link,
            lyrics
        });
    });

    // console.log(results);

    return results;
};

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
