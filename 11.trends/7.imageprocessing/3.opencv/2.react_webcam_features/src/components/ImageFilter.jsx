import React, { useRef, useState, useEffect } from 'react';

const ImageFilter = ({ imageSrc }) => {
    const canvasRef = useRef(null);
    const [originalImage, setOriginalImage] = useState(null); // 원본 이미지 상태 저장

    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                setOriginalImage(canvas.toDataURL('image/png')); // 원본 이미지를 상태에 저장
            };
        }
    }, [imageSrc]);

    // 이미지 필터 적용 로직
    const applyFilter = (filter) => {
        if (!originalImage) {
            alert("❌ 먼저 이미지를 업로드해주세요.");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        switch (filter) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
                break;
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189;
                    data[i + 1] = data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168;
                    data[i + 2] = data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131;
                }
                break;
            case 'invert':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;
            default:
                break;
        }
        ctx.putImageData(imageData, 0, 0);
    };

    // 원래대로 되돌리기
    const resetImage = () => {
        if (!originalImage) {
            alert("❌ 먼저 이미지를 업로드해주세요.");
            return;
        }
        const img = new Image();
        img.src = originalImage;
        img.onload = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    return (
        <div>
            <h2>Image Filter</h2>
            <button onClick={resetImage}>Original Image</button>
            <button onClick={() => applyFilter('grayscale')}>Grayscale</button>
            <button onClick={() => applyFilter('sepia')}>Sepia</button>
            <button onClick={() => applyFilter('invert')}>Invert</button>
            <br />

            {/* 캔버스에 이미지 렌더링 */}
            <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
        </div>
    );
};

export default ImageFilter;
