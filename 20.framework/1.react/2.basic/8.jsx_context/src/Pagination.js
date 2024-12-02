import React from "react";
import { useTheme } from "./ThemeContext";

const Pagination = () => {
    const { isDarkMode } = useTheme();

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <a className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li className="page-item"><a className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} href="#">1</a></li>
                <li className="page-item"><a className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} href="#">2</a></li>
                <li className="page-item"><a className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} href="#">3</a></li>
                <li className="page-item">
                    <a className={`page-link ${isDarkMode ? "bg-dark text-light" : ""}`} href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
