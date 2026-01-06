// src/index.js 파일
// React 17
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// src/index.js 파일
// React 18
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React 18 방식으로 root 생성 및 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
