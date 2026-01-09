import { Routes, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import UserDetail from './pages/UserDetail.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />

                {/* Users 목록 */}
                <Route path="users" element={<Users />} />

                {/* 동적 라우트 */}
                <Route path="users/:userId" element={<UserDetail />} />

                <Route path="about" element={<About />} />

                {/* NotFound 처리 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
