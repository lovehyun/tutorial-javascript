import React, { useState } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import "../styles/App.css";

function App() {
    const [isWriting, setIsWriting] = useState(false);

    const handleWriteButtonClick = () => {
        setIsWriting(true);
    };

    const handlePostCreated = () => {
        setIsWriting(false);
    };

    const handlePostDeleted = () => {
        setIsWriting(false);
    };

    return (
        <div>
            <h1>게시판</h1>
            {isWriting ? (
                <PostForm onPostCreated={handlePostCreated} />
            ) : (
                <>
                    <PostList onPostDeleted={handlePostDeleted} />
                    <button className="write-button" onClick={handleWriteButtonClick}>
                        글 작성
                    </button>
                </>
            )}
        </div>
    );
}

export default App;
