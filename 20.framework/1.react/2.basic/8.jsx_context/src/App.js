import React from "react";
import Navbar from "./Navbar";
import Table from "./Table";
import Pagination from "./Pagination";
import { ThemeProvider } from "./ThemeContext";

const App = () => {
    return (
        <ThemeProvider>
            <Navbar />

            <main className="container mt-4">
                <Table />
            </main>
            
            <Pagination />
        </ThemeProvider>
    );
};

export default App;
