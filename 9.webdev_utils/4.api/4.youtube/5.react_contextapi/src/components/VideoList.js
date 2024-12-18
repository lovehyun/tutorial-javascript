import React from 'react';
import VideoListItem from './VideoListItem';

const VideoList = ({ videos, onVideoSelect }) => (
    <ul style={{ listStyle: 'none', padding: 0 }}>
        {videos.map((video) => (
            <VideoListItem key={video.id.videoId} video={video} onVideoSelect={onVideoSelect} />
        ))}
    </ul>
);

export default VideoList;
