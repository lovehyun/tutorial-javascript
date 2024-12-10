import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Kooooogle</h1>
                </header>
                <main className="App-content">
                    <Routes>
                        {/* 메인 페이지 */}
                        <Route path="/" element={<Home />} />
                    </Routes>
                </main>
                <footer className="App-footer">
                    <p>© 2024 Kooooogle. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
