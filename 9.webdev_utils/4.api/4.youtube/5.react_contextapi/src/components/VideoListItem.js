import React from 'react';

const VideoListItem = ({ video, onVideoSelect }) => (
    <li
        onClick={() => onVideoSelect(video)}
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
);

export default VideoListItem;
