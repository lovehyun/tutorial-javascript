import React from "react";
import { useTheme } from "./ThemeContext";

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <nav className={`navbar navbar-expand-sm ${isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#">MyLogo</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><a className="nav-link" href="#">User</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Order</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Order Item</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Item</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Store</a></li>
                    </ul>
                    <button className="btn btn-outline-secondary" onClick={toggleTheme}>
                        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
