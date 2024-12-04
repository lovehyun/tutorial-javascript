import React, { useEffect } from "react";

import Navbar from "./Navbar";
import Table from "./Table";
import Pagination from "./Pagination";
import { useTheme } from "./ThemeContext";

const App = () => {
    const { isDarkMode } = useTheme();

    // 다크 모드 상태에 따라 <body> 클래스 설정
    useEffect(() => {
        document.body.className = isDarkMode ? "bg-dark text-light" : "bg-light text-dark";
    }, [isDarkMode]);

    return (
        <div>
            <Navbar />
            <Table />
            <Pagination />
        </div>
    );
};

export default App;
