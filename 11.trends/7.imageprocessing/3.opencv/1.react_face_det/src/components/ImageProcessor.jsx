import React, { useState, useRef, useEffect } from 'react';

// OpenCV.js에서 사용할 얼굴 인식 XML 파일
const faceCascadeURL = 'https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml';

const ImageProcessor = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [message, setMessage] = useState(''); // ✅ 얼굴 탐지 결과 메시지 추가
    const canvasRef = useRef(null);
    const faceCascadeRef = useRef(null); // ✅ 얼굴 탐지 모델을 유지하기 위한 useRef

    // ✅ OpenCV 및 Cascade 파일 로드
    useEffect(() => {
        const loadOpenCV = async () => {
            if (window.cv) {
                console.log("✅ OpenCV 로딩 완료");
                await loadCascadeFile();
            } else {
                console.error("❌ OpenCV 로딩 실패");
            }
        };

        const loadCascadeFile = async () => {
            const response = await fetch(faceCascadeURL);
            const buffer = await response.arrayBuffer();
            window.cv.FS_createDataFile('/', 'haarcascade_frontalface_default.xml', new Uint8Array(buffer), true, false, false);
            faceCascadeRef.current = new window.cv.CascadeClassifier();
            if (!faceCascadeRef.current.load('haarcascade_frontalface_default.xml')) {
                console.error("❌ Haar Cascade 파일 로딩 실패!");
            } else {
                console.log("✅ Haar Cascade 파일 로딩 성공!");
            }
        };

        window.cv['onRuntimeInitialized'] = loadOpenCV;
    }, []);

    // ✅ 이미지 업로드 및 캔버스에 렌더링
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setMessage(''); // 기존 메시지 초기화
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // ✅ Canny Edge Detection (엣지 감지)
    const detectEdges = () => {
        if (!imageSrc) {
            alert("이미지를 먼저 업로드해주세요!");
            return;
        }

        const canvas = canvasRef.current;
        const src = window.cv.imread(canvas);
        const gray = new window.cv.Mat();
        const dst = new window.cv.Mat();

        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
        window.cv.Canny(gray, dst, 50, 150);
        window.cv.imshow(canvas, dst);

        // ✅ 메모리 해제
        src.delete();
        gray.delete();
        dst.delete();

        setMessage("✅ Canny Edge Detection 완료");
    };

    // ✅ 얼굴 탐지 (Haar Cascade)
    const detectFaces = () => {
        if (!imageSrc) {
            alert("이미지를 먼저 업로드해주세요!");
            return;
        }

        const canvas = canvasRef.current;
        const src = window.cv.imread(canvas);
        const gray = new window.cv.Mat();
        const faces = new window.cv.RectVector();

        window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

        // ✅ 얼굴 탐지 수행
        faceCascadeRef.current.detectMultiScale(gray, faces, 1.1, 3, 0);

        // ✅ 얼굴이 감지되지 않았을 때 메시지 표시
        if (faces.size() === 0) {
            setMessage("❌ 얼굴을 찾을 수 없습니다.");
        } else {
            for (let i = 0; i < faces.size(); ++i) {
                const face = faces.get(i);
                window.cv.rectangle(
                    src,
                    new window.cv.Point(face.x, face.y),
                    new window.cv.Point(face.x + face.width, face.y + face.height),
                    [255, 0, 0, 255], 2
                );
            }
            setMessage(`✅ ${faces.size()}개의 얼굴을 탐지했습니다.`);
        }

        window.cv.imshow(canvas, src);

        // ✅ 메모리 해제
        src.delete();
        gray.delete();
        faces.delete();
    };

    return (
        <div>
            <h2>React OpenCV.js - Edge & Face Detection</h2>
            
            {/* ✅ 이미지 업로드 */}
            <input type="file" onChange={handleImageUpload} accept="image/*" />

            {/* ✅ 버튼 */}
            <button onClick={detectEdges}>Canny Edge Detection</button>
            <button onClick={detectFaces}>Face Detection</button>

            {/* ✅ 메시지 출력 */}
            <p><strong>{message}</strong></p>

            {/* ✅ 캔버스 */}
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default ImageProcessor;
