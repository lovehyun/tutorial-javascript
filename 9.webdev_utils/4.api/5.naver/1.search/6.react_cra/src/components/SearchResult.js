import React from 'react';

function SearchResults({ query, results, loading, error }) {
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (results.length === 0 && query) return <p>No results found for "{query}".</p>;

    return (
        <ul style={{ listStyle: 'none', padding: '0' }}>
            {results.map((item, index) => (
                <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                    <h2>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                        </a>
                    </h2>
                    <p>{item.description}</p>
                    <small>Post Date: {item.postdate}</small>
                </li>
            ))}
        </ul>
    );
}

export default SearchResults;

{/* <a href={item.link} target="_blank" rel="noopener noreferrer">
  - 보안 및 성능 관련 속성을 추가로 설정합니다. target="_blank"를 사용할 때 함께 사용하는 것이 권장됩니다.
    noopener:
      새로 열린 페이지가 부모 페이지에 대한 JavaScript 컨텍스트 접근을 차단합니다.
      이를 통해 window.opener를 통해 원본 페이지를 제어하려는 공격을 방지합니다.
    noreferrer:
      새로 열린 페이지로 참조자(referrer) 정보를 전달하지 않음을 의미합니다.
      이는 개인 정보를 보호하거나 서버 로그에 원본 URL을 기록하지 않도록 설정할 때 사용됩니다. */}
