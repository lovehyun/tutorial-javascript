import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const FaceDetection = ({ canvasRef }) => {
    const modelRef = useRef(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    // Load blazeface model
    useEffect(() => {
        const loadModel = async () => {
            try {
                modelRef.current = await blazeface.load();
                setModelLoaded(true);
                console.log("✅ 모델 로딩 완료");
            } catch (error) {
                console.error("❌ 모델 로딩 실패:", error);
            }
        };
        loadModel();
    }, []);

    // Face detection function
    const detectFaces = async () => {
        if (!canvasRef.current || !modelRef.current) {
            alert("❌ 캔버스와 모델이 준비되지 않았습니다.");
            return;
        }

        try {
            const img = tf.browser.fromPixels(canvasRef.current);
            const predictions = await modelRef.current.estimateFaces(img, false);
            img.dispose();

            if (predictions.length > 0) {
                const ctx = canvasRef.current.getContext('2d');
                
                predictions.forEach(prediction => {
                    const start = prediction.topLeft;
                    const end = prediction.bottomRight;
                    const size = [end[0] - start[0], end[1] - start[1]];

                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(start[0], start[1], size[0], size[1]);

                    // 랜드마크 그리기
                    prediction.landmarks.forEach(landmark => {
                        ctx.beginPath();
                        ctx.arc(landmark[0], landmark[1], 3, 0, 2 * Math.PI);
                        ctx.fillStyle = '#ff0000';
                        ctx.fill();
                        ctx.closePath();
                    });
                });
                console.log("✅ 얼굴 탐지 완료:", predictions.length, "개의 얼굴 감지됨");
            } else {
                alert("⚠️ 얼굴을 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("❌ 얼굴 탐지 중 오류:", error);
            alert("얼굴 탐지에 실패했습니다.");
        }
    };

    return (
        <button 
            onClick={detectFaces} 
            disabled={!modelLoaded}
            className="detection-button"
        >
            {modelLoaded ? "얼굴 감지" : "얼굴 모델 로딩중"}
        </button>
    );
};

export default FaceDetection;
