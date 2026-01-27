import React from 'react';
import SearchBar from './components/SearchBar';
import SearchResult from './components/SearchResult';

function App() {
    return (
        <div>
            <h1>Blog Search</h1>
            <SearchBar />
            <SearchResult />
        </div>
    );
}

export default App;
