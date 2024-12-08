import React, { useState } from 'react';
import axios from 'axios';

const YouTubeApp = () => {
    const [query, setQuery] = useState(''); // 검색어
    const [videos, setVideos] = useState([]); // 검색 결과
    const [selectedVideo, setSelectedVideo] = useState(null); // 선택된 동영상

    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const BASE_URL = 'https://www.googleapis.com/youtube/v3';

    // 검색어 입력 핸들러
    const handleSearchInputChange = (e) => {
        setQuery(e.target.value);
    };

    // 검색 버튼 클릭 핸들러
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

            setVideos(response.data.items); // 검색 결과 저장
            setSelectedVideo(null); // 재생 중인 동영상 초기화
        } catch (err) {
            console.error('Error fetching videos:', err);
        }
    };

    // 동영상 클릭 핸들러
    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>YouTube Search & Play</h1>

            {/* 검색창 */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchInputChange}
                    placeholder="Search YouTube videos..."
                    style={{ padding: '10px', width: '300px', fontSize: '16px' }}
                />
                <button onClick={handleSearch} style={{ padding: '10px', marginLeft: '10px', fontSize: '16px' }}>
                    Search
                </button>
            </div>

            {/* 동영상 재생 */}
            {selectedVideo && (
                <div style={{ marginBottom: '20px' }}>
                    <h2>{selectedVideo.snippet.title}</h2>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {/* 검색 결과 */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {videos.map((video) => (
                    <li
                        key={video.id.videoId}
                        onClick={() => handleVideoSelect(video)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            cursor: 'pointer',
                        }}
                    >
                        <img
                            src={video.snippet.thumbnails.medium.url}
                            alt={video.snippet.title}
                            style={{ width: '120px', marginRight: '10px' }}
                        />
                        <div>
                            <h3 style={{ margin: 0 }}>{video.snippet.title}</h3>
                            <p style={{ margin: 0 }}>{video.snippet.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YouTubeApp;
