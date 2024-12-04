import React, { useState } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import "./App.css";

function App() {
    const [isWriting, setIsWriting] = useState(false);

    const handleWriteButtonClick = () => {
        setIsWriting(true);
    };

    const handlePostCreated = () => {
        setIsWriting(false); // 작성 완료 후 리스트로 돌아감
    };

    return (
        <div>
            <h1>게시판</h1>
            {isWriting ? (
                <PostForm onPostCreated={handlePostCreated} />
            ) : (
                <>
                    <PostList />
                    <button className="write-button" onClick={handleWriteButtonClick}>
                        글 작성
                    </button>
                </>
            )}
        </div>
    );
}

export default App;
