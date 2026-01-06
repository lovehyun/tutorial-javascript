import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Bootstrap CSS 가져오기 (react-bootstrap 사용 시 필수)
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
