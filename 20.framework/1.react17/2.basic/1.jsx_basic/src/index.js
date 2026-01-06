import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18이후 문법. ReactDOM.createRoot를 사용합니다.
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
