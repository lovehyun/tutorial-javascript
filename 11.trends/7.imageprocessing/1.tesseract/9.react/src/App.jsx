// src/App.jsx
import React, { useState } from 'react';

function App() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [ocrText, setOcrText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) {
            alert('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setOcrText(data.extractedText);
            setPreview(`http://localhost:3000${data.imageUrl}`);
        } catch (error) {
            alert('Failed to upload image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>React + Express OCR</h1>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Processing...' : 'Upload and Extract Text'}
            </button>
            {preview && <img src={preview} alt="Uploaded" style={{ maxWidth: '100%' }} />}
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
