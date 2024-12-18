import React from 'react';

const VideoPlayer = ({ video }) => {
    if (!video) return null;

    return (
        <div style={{ marginBottom: '20px' }}>
            <h2>{video.snippet.title}</h2>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default VideoPlayer;
