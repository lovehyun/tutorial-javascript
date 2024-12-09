import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';

const YouTubeApp = () => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const BASE_URL = 'https://www.googleapis.com/youtube/v3';

    const handleSearch = async () => {
        if (!query) return;

        try {
            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: 'snippet',
                    q: query,
                    maxResults: 10,
                    key: API_KEY,
                },
            });

            setVideos(response.data.items);
            setSelectedVideo(null);
        } catch (err) {
            console.error('Error fetching videos:', err);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>YouTube Search & Play</h1>
            <SearchBar query={query} onInputChange={setQuery} onSearch={handleSearch} />
            <VideoPlayer video={selectedVideo} />
            <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
        </div>
    );
};

export default YouTubeApp;
