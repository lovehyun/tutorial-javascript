import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setQuery, setVideos, setSelectedVideo } from './redux/videoSlice';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
// import VideoList from './components/VideoListTotal';

const YouTubeApp = () => {
    const dispatch = useDispatch();
    const query = useSelector((state) => state.videos.query);
    const videos = useSelector((state) => state.videos.videos);
    const selectedVideo = useSelector((state) => state.videos.selectedVideo);

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

            dispatch(setVideos(response.data.items));
            dispatch(setSelectedVideo(null));
        } catch (err) {
            console.error('Error fetching videos:', err);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>YouTube Search & Play</h1>
            <SearchBar query={query} onInputChange={(q) => dispatch(setQuery(q))} onSearch={handleSearch} />
            <VideoPlayer video={selectedVideo} />
            <VideoList videos={videos} onVideoSelect={(video) => dispatch(setSelectedVideo(video))} />
        </div>
    );
};

export default YouTubeApp;
