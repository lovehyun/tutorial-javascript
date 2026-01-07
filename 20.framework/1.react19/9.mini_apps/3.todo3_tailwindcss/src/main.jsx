// tailwind v4 기준 (v3 에서는 완전히 다름)
// npm i -D tailwindcss @tailwindcss/vite
// vite.config.js 에서 tailwindcss 관련 내용 추가

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
