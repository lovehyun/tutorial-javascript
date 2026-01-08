// src/routes/posts.routes.js
import Posts from '../pages/Posts.jsx';
import PostDetail from '../pages/PostDetail.jsx';

import { postsLoader, postDetailLoader } from '../handlers/posts.handlers.js';

export default [
    {
        path: 'posts',
        element: <Posts />,
        loader: postsLoader,
    },
    {
        path: 'posts/:postId',
        element: <PostDetail />,
        loader: postDetailLoader,
    },
];
