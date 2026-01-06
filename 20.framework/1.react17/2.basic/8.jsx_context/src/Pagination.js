import React from "react";
import { useTheme } from "./ThemeContext";

const Pagination = () => {
    const { isDarkMode } = useTheme();

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <span className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} aria-label="Previous">
                        &laquo;
                    </span>
                </li>
                <li className="page-item">
                    <span className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`}>1</span>
                </li>
                <li className="page-item">
                    <span className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`}>2</span>
                </li>
                <li className="page-item">
                    <span className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`}>3</span>
                </li>
                <li className="page-item">
                    <span className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} aria-label="Next">
                        &raquo;
                    </span>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
