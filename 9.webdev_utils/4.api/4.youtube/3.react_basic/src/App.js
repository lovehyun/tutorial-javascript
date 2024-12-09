import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YouTubeAPIExample = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // .env 파일에서 API 키 읽기
    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const BASE_URL = 'https://www.googleapis.com/youtube/v3/';

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/videos`, {
                    params: {
                        part: 'snippet,contentDetails,statistics',
                        chart: 'mostPopular',
                        regionCode: 'KR',
                        maxResults: 10,
                        key: API_KEY,
                    },
                });
                setVideos(response.data.items);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch videos.');
                setLoading(false);
            }
        };

        fetchVideos();
    }, [API_KEY]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>KR Popular Videos Top 10</h1>
            <ul>
                {videos.map((video) => (
                    <li key={video.id}>
                        <h2>{video.snippet.title}</h2>
                        <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                        <p>{video.snippet.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YouTubeAPIExample;
