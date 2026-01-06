import React from "react";
import { useTheme } from "./ThemeContext";

const Table = () => {
    const { isDarkMode } = useTheme();

    return (
        <table className={`table ${isDarkMode ? "table-dark" : "table-striped"}`}>
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Data 1</td><td>Data 2</td><td>Data 3</td></tr>
                <tr><td>Data 4</td><td>Data 5</td><td>Data 6</td></tr>
                <tr><td>Data 7</td><td>Data 8</td><td>Data 9</td></tr>
                <tr><td>Data 10</td><td>Data 11</td><td>Data 12</td></tr>
                <tr><td>Data 13</td><td>Data 14</td><td>Data 15</td></tr>
            </tbody>
        </table>
    );
};

export default Table;
