import React, { useState } from "react";
import "./PostForm.css"; // 스타일을 포함한 CSS 파일 추가

function PostForm({ onPostCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                body: formData,
            });
            setTitle("");
            setContent("");
            setPhoto(null);
            onPostCreated(); // 작성 완료 후 App으로 상태 전달
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    return (
        <div className="form-container">
            <h2>글 작성</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    제목:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="input"
                    />
                </label>
                <label>
                    내용:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="textarea"
                    ></textarea>
                </label>
                <label>
                    사진 첨부:
                    <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="file-input"
                    />
                </label>
                <button type="submit" className="submit-button">
                    작성
                </button>
            </form>
        </div>
    );
}

export default PostForm;
