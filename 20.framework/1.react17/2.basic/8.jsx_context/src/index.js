import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeSelector } from "./ThemeContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeSelector>
    <App />
    </ThemeSelector>
  </React.StrictMode>
);
