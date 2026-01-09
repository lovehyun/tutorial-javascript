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

                {/* 형제관계로 위처럼 묶을 것이냐? 부모자식처럼 아래로 묶을것이냐? 설계철학
                <Route path="users">
                    <Route index element={<Users />} />
                    <Route path=":userId" element={<UserDetail />} />
                </Route>
                */}
                
                <Route path="about" element={<About />} />

                {/* NotFound 처리 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
