import React, { useRef, useEffect } from 'react';
import FaceDetection from './FaceDetection';
import HandDetection from './HandDetection';

const Detection = ({ imageSrc }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (imageSrc) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            
            img.src = imageSrc;
        }
    }, [imageSrc]);

    return (
        <div className="detection-container">
            <h2>Detection Controls</h2>
            <div className="button-container">
                <FaceDetection canvasRef={canvasRef} />
                <HandDetection canvasRef={canvasRef} />
            </div>
            <canvas ref={canvasRef} className="detection-canvas" />
        </div>
    );
};

export default Detection;
