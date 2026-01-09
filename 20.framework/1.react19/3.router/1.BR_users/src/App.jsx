import { Routes, Route } from 'react-router-dom';

import RootLayout from './layouts/RootLayout.jsx';
import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    return (
        <Routes>
            {/* 레이아웃(공통 네비/껍데기) */}
            <Route path="/" element={<RootLayout />}>
                {/* index 라우트: "/" */}
                <Route index element={<Home />} />

                {/* 일반 라우트: "/users", "/about" */}
                <Route path="users" element={<Users />} />
                <Route path="about" element={<About />} />

                {/* 404 NotFound 처리 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
