// pages/Home.jsx
import React, { useState } from 'react';
import SearchForm from '../components/SearchForm/SearchForm';
import Results from '../components/Results/Results';
import Pagination from '../components/Pagination/Pagination';
import { fetchResults } from '../utils/api';

const Home = () => {
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [type, setType] = useState('');

    const handleSearch = async (query, searchType) => {
        try {
            const data = await fetchResults(query, searchType, 1);
            setType(searchType);
            setResults(data.documents || []);
            setTotalPages(Math.ceil(data.meta.pageable_count / 10));
            setCurrentPage(1);
        } catch (error) {
            console.error(error.message);
            alert('검색에 실패했습니다.');
        }
    };

    const handlePageChange = async (page) => {
        try {
            const data = await fetchResults(results.query, type, page);
            setResults(data.documents || []);
            setCurrentPage(page);
        } catch (error) {
            console.error(error.message);
            alert('페이지를 변경할 수 없습니다.');
        }
    };

    return (
        <div>
            <SearchForm onSearch={handleSearch} />
            <Results type={type} results={results} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default Home;
