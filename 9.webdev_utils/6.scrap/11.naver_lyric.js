const axios = require('axios');

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

        // Process the response data as needed
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching lyrics:', error.message);
    }
};

// 함수 호출
searchMusicWithLyrics("동해물과 백두산이");
