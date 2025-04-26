import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const fetchPosts = () => api.get('/api/posts');
export const createPost = (formData) => api.post('/api/posts', formData);
export const deletePost = (id) => api.delete(`/api/posts/${id}`);
