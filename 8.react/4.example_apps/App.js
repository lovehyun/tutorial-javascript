// App.js
// npm install react-router-dom

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MemoApp from './MemoApp';
import TodoApp from './TodoApp';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="menu">
            <ul>
              <li>
                <Link to="/">홈</Link>
              </li>
              <li>
                <Link to="/memo">메모 앱</Link>
              </li>
              <li>
                <Link to="/todo">투두 앱</Link>
              </li>
            </ul>
          </nav>
        </header>
        <section>
          <Routes>
            <Route path="/" element={<div><h1>홈 페이지</h1></div>} />
            <Route path="/memo" element={<MemoApp />} />
            <Route path="/todo" element={<TodoApp />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
