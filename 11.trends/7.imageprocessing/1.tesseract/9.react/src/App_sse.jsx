// src/App.jsx
import React, { useState } from 'react';

function App() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [ocrText, setOcrText] = useState('');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setProgress(0);
        setOcrText('');
    };

    // 업로드 및 SSE 시작
    const handleUpload = async () => {
        if (!image) {
            alert('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);
        setProgress(0);

        try {
            // 업로드 요청 (백엔드에 업로드 요청만 보냄, SSE는 별도로 실행)
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image.');
            }

            // SSE 연결을 위한 EventSource 사용
            const eventSource = new EventSource('http://localhost:3000/progress');

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setProgress(data.progress);
                setOcrText(data.text);

                // OCR이 완료되었을 때 이미지와 진행률 표시 업데이트
                if (data.progress === 1) {
                    eventSource.close();
                    setLoading(false);
                    // alert('OCR completed successfully!');
                }
            };

            eventSource.onerror = () => {
                alert('Error receiving progress updates.');
                setLoading(false);
                eventSource.close();
            };

        } catch (error) {
            alert('Error during image upload.');
            setLoading(false);
            console.error(error);
        }
    };

    return (
        <div>
            <h1>React + Express + Worker Thread OCR</h1>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Processing...' : 'Upload and Extract Text'}
            </button>

            {preview && (
                <div>
                    <h2>Uploaded Image:</h2>
                    <img src={preview} alt="Uploaded" style={{ maxWidth: '100%' }} />
                </div>
            )}

            {/* 프로그레스 바 표시 */}
            <div>
                <h2>Progress: {Math.round(progress * 100)}%</h2>
                <progress value={progress} max="1" style={{ width: '100%' }}></progress>
            </div>

            {/* OCR 결과 표시 */}
            {ocrText && (
                <div>
                    <h2>Extracted Text:</h2>
                    <pre>{ocrText}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
