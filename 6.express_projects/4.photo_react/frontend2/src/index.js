import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/App.css"; // 글로벌 스타일을 적용

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
