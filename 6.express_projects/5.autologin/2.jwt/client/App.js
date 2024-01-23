// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      const { token } = response.data;

      // 토큰을 저장
      localStorage.setItem('token', token);

      // 로그인 상태 업데이트
      onLogin();
    } catch (error) {
      console.error('로그인 실패:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <div>
        <label>
          아이디:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          비밀번호:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          자동 로그인
          <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
        </label>
      </div>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

const PrivateRoute = ({ children, isAuthenticated }) => (
  <Route
    render={({ location }) =>
      isAuthenticated ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
      )
    }
  />
);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <Router>
      <div>
        <PrivateRoute path="/dashboard" isAuthenticated={loggedIn}>
          <h2>대시보드</h2>
          <p>로그인 성공!</p>
        </PrivateRoute>

        <Route path="/login">
          <LoginForm onLogin={handleLogin} />
        </Route>
      </div>
    </Router>
  );
};

export default App;
