// npm install @tensorflow/tfjs @tensorflow-models/blazeface

import React, { useState } from 'react';
import WebcamStream from './components/WebcamStream';
import Detection from './components/Detection';
import ImageFilter from './components/ImageFilter';

function App() {
    const [capturedImage, setCapturedImage] = useState(null);

    return (
        <div>
            <h1>Webcam Image Processing App</h1>
            
            {/* ✅ 웹캠 스트리밍 및 캡처 */}
            <WebcamStream onCapture={setCapturedImage} />
            
            {/* ✅ 얼굴 및 손 감지 */}
            {capturedImage && <Detection imageSrc={capturedImage} />}
            
            {/* ✅ 이미지 필터 */}
            {capturedImage && <ImageFilter imageSrc={capturedImage} />}
        </div>
    );
}

export default App;
