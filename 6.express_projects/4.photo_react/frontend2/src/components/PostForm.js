import React, { useState } from "react";
import { createPost } from "../api/api";
import "../styles/PostForm.css";

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
            await createPost(formData);
            setTitle("");
            setContent("");
            setPhoto(null);
            onPostCreated();
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
