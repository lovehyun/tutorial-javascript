import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './Users';
import UserDetail from './UserDetail';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Dynamic Routing Example</h1>
                <Routes>
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:userId" element={<UserDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
