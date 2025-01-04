import React, { useEffect, useRef, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';

const HandDetection = ({ canvasRef }) => {
    const modelRef = useRef(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            try {
                modelRef.current = await handpose.load();
                setModelLoaded(true);
                console.log("손 감지 모델 로딩 완료");
            } catch (error) {
                console.error("손 감지 모델 로딩 실패:", error);
            }
        };
        loadModel();
    }, []);

    const drawHand = (ctx, hand) => {
        const fingers = [
            [0, 1, 2, 3, 4],
            [0, 5, 6, 7, 8],
            [0, 9, 10, 11, 12],
            [0, 13, 14, 15, 16],
            [0, 17, 18, 19, 20]
        ];

        fingers.forEach(finger => {
            for (let i = 1; i < finger.length; i++) {
                const start = hand.landmarks[finger[i - 1]];
                const end = hand.landmarks[finger[i]];
                
                ctx.beginPath();
                ctx.moveTo(start[0], start[1]);
                ctx.lineTo(end[0], end[1]);
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });

        hand.landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
        });
    };

    const detectHands = async () => {
        if (!canvasRef.current || !modelRef.current) return;

        try {
            // 원본 이미지 저장
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            console.log("🔍 손 감지 시작...");
            const hands = await modelRef.current.estimateHands(canvas);
            console.log("✅ 감지된 손의 개수:", hands.length);
            
            if (hands.length > 0) {
                hands.forEach((hand, index) => {
                    console.log(`👋 손 ${index + 1}:`, {
                        landmarks: `${hand.landmarks.length}개의 포인트`
                    });
                });
            } else {
                console.log("⚠️ 감지된 손이 없습니다");
            }

            ctx.putImageData(originalImageData, 0, 0);
            hands.forEach(hand => {
                drawHand(ctx, hand);
            });
        } catch (error) {
            console.error("❌ 손 감지 오류:", error);
        }
    };

    return (
        <button 
            onClick={detectHands} 
            disabled={!modelLoaded}
        >
            {modelLoaded ? "손 감지" : "손 모델 로딩중"}
        </button>
    );
};

export default HandDetection;
