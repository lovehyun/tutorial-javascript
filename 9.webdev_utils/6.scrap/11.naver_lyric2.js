const axios = require('axios');
const cheerio = require('cheerio');

const searchMusicWithLyrics = async (query) => {
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

        // Process the response data with Cheerio
        // Process the current HTML
        const currentHTML = response.data.current.html;
        const currentResults = processLyricsInfo(currentHTML);

        // Process the next HTML
        const nextHTML = response.data.next.html;
        const nextResults = processLyricsInfo(nextHTML);

        // Combine the results if needed
        const allResults = currentResults.concat(nextResults);

        // Do something with the final results
        console.log('Final Results:', allResults);

    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
    }
};

// 가사 정보를 처리하는 함수
const processLyricsInfo = (html) => {
    const $ = cheerio.load(html);

    const results = [];

    $('li[role="tab"]').each((index, element) => {
        const title = $(element).find('.music_title a').text().trim();
        const artist = $(element).find('.music_detail a').text().trim();

        results.push({
            title,
            artist,
        });
    });

    return results;
};

// 함수 호출
searchMusicWithLyrics("동해물과 백두산이");
