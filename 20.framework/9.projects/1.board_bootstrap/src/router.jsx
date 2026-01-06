import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import PostList from './pages/PostList.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostForm from './pages/PostForm.jsx';
import NotFound from './pages/NotFound.jsx';

export default createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <PostList /> },
            { path: 'posts', element: <PostList /> },
            { path: 'posts/new', element: <PostForm mode="create" /> },
            { path: 'posts/:id', element: <PostDetail /> },
            { path: 'posts/:id/edit', element: <PostForm mode="edit" /> },
        ],
    },
]);
