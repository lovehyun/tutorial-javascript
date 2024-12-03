// index.js
import React from 'react';
// import ReactDOM from 'react-dom'; // React 17까지
import ReactDOM from 'react-dom/client'; // React 18이후
// import App from './App';

const App = () => {
    return <h1>Hello, World!</h1>;
};

// React 17까지
// ReactDOM.render(<App />, document.getElementById('root'));

// React 18이후
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
