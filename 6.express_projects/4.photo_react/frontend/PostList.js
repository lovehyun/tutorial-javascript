import React, { useEffect, useState } from "react";

function PostList() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/posts");
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (index) => {
        try {
            await fetch(`http://localhost:3000/api/posts/${index + 1}`, {
                method: "DELETE",
            });
            fetchPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>내용</th>
                    <th>썸네일</th>
                    <th>작성일</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{post.title}</td>
                        <td>{post.content}</td>
                        <td>
                            {post.thumbnailPath ? (
                                <a
                                    href={`http://localhost:3000/images/${post.filename}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={`http://localhost:3000/${post.thumbnailPath}`}
                                        alt="썸네일"
                                        style={{ maxWidth: 100, maxHeight: 100 }}
                                    />
                                </a>
                            ) : (
                                "(없음)"
                            )}
                        </td>
                        <td>{new Date(post.date).toLocaleString()}</td>
                        <td>
                            <button onClick={() => handleDelete(index)}>
                                삭제
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PostList;
