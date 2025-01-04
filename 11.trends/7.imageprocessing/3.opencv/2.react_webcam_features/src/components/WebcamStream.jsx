import React, { useEffect, useRef } from 'react';

const WebcamStream = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 웹캠 스트리밍 시작
    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;
            } catch (error) {
                console.error("웹캠 접근 실패:", error);
            }
        };
        startWebcam();
    }, []);

    // 캔버스에 웹캠 프레임 복사
    const captureImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const capturedImage = canvas.toDataURL('image/png');
        onCapture(capturedImage);  // 부모 컴포넌트에 캡처 이미지를 전달
    };

    return (
        <div>
            <h2>Webcam Stream</h2>
            <button onClick={captureImage}>Capture Image</button><br />
            <video ref={videoRef} autoPlay muted style={{ width: '300px' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default WebcamStream;
