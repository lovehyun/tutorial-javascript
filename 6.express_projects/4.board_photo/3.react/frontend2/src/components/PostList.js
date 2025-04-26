import React, { useEffect, useState } from "react";
import { fetchPosts, deletePost } from "../api/api";
import { formatDate } from "../utils/dateUtils";
import "../styles/Table.css";

function PostList() {
    const [posts, setPosts] = useState([]);

    const loadPosts = async () => {
        try {
            const { data } = await fetchPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    const handleDelete = async (index) => {
        try {
            // 서버에 삭제 요청
            await deletePost(index + 1);
    
            // posts 상태를 갱신 (삭제된 항목 제외)
            setPosts((prevPosts) =>
                prevPosts.filter((_, i) => i !== index) // index와 일치하지 않는 항목만 유지
            );
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };
    
    useEffect(() => {
        loadPosts(); // 초기 로드
    }, []);

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
                        <td>{formatDate(post.date)}</td>
                        <td>
                            <button onClick={() => handleDelete(index)}>삭제</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default PostList;
