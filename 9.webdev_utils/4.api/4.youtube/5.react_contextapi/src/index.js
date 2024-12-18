import React from 'react';
import ReactDOM from 'react-dom/client';
import VideoProvider from './context/VideoContext';
import App from './App3_components';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <VideoProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </VideoProvider>
);
