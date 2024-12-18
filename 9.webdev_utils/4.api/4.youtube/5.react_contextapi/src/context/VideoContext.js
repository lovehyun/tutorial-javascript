import React, { createContext, useState } from 'react';

export const VideoContext = createContext();

const VideoProvider = ({ children }) => {
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <VideoContext.Provider value={{ query, setQuery, videos, setVideos, selectedVideo, setSelectedVideo }}>
            {children}
        </VideoContext.Provider>
    );
};

export default VideoProvider;
