// npm install bootstrap
import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
import App from './App2_components.jsx';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// [React]
// fetch('/search/blog?query=커피')
//         ↓
// [Vite proxy] = vite.config.js
//         ↓
// [Express 서버]
//         ↓
// [Naver OpenAPI]
