import React from 'react';
import './Results.css';

const Results = ({ type, results }) => {
    if (!results || results.length === 0) {
        return <div className="results">No results found.</div>;
    }

    // 새 창 열기 함수
    const openImageInNewWindow = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="results">
            {results.map((item, index) => (
                <div className="result" key={index}>
                    {type === 'web' && (
                        <>
                            {/* <h3 className="result-title">{item.title}</h3> */}
                            <h3
                                className="result-title"
                                dangerouslySetInnerHTML={{ __html: item.title }}
                            ></h3>
                            {/* <p className="result-contents">{item.contents}</p> */}
                            <p
                                className="result-contents"
                                dangerouslySetInnerHTML={{ __html: item.contents }}
                            ></p>

                            <a href={item.url} target="_blank" rel="noreferrer" className="result-link">
                                {item.url}
                            </a>
                        </>
                    )}
                    {type === 'image' && (
                        <div className="image-result">
                            {/* 왼쪽 이미지 */}
                            {/* <img src={item.thumbnail_url} alt="Thumbnail" className="result-thumbnail" /> */}
                            {/* 이미지 클릭 시 새 창에서 원본 표시 */}
                            <img
                                src={item.thumbnail_url}
                                alt="Thumbnail"
                                className="result-thumbnail"
                                onClick={() => openImageInNewWindow(item.image_url)} // 원본 이미지 URL
                                style={{ cursor: 'pointer' }} // 클릭 가능 표시
                            />

                            {/* 오른쪽 텍스트 내용 */}
                            <div className="result-content">
                                <p className="result-sitename">{item.display_sitename}</p>
                                <a href={item.doc_url} target="_blank" rel="noreferrer" className="result-link">
                                    {item.doc_url}
                                </a>
                                <p>
                                    Width: {item.width}, Height: {item.height}
                                </p>
                                <p>Datetime: {item.datetime}</p>
                            </div>
                        </div>
                    )}
                    {type === 'vclip' && (
                        <div className="vclip-result">
                            {/* 왼쪽 텍스트 */}
                            <div className="vclip-text">
                                <h3 className="result-title">{item.title}</h3>
                                <p>Author: {item.author}</p>
                                <a 
                                    href={item.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="result-link"
                                >
                                    {item.url}
                                </a>
                                <p>Datetime: {item.datetime}</p>
                            </div>
                            {/* 오른쪽 이미지와 재생 시간 */}
                            <div className="vclip-media">
                                <img
                                    src={item.thumbnail}
                                    alt="Thumbnail"
                                    className="result-thumbnail"
                                    onClick={() => openImageInNewWindow(item.url)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <p>Play Time: {item.play_time} seconds</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Results;
