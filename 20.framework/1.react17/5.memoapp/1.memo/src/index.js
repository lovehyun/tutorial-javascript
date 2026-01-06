import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // 스타일 파일 연결 (필요 시)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
