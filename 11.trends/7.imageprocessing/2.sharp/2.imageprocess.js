// 이미지 크기 조정: .resize(500, 500)
// 이미지 회전: .rotate(90)
// 이미지 반전: .flip(), .flop()
// 샤프닝: .sharpen()
// 블러: .blur(5)
// 워터마크 추가: .composite()
// 이미지 합성: .composite() + .create()
// 포맷 변환: .toFormat('png')
// 품질 조정: .jpeg({ quality: 70 })
// 이미지 메타데이터: .metadata()

const sharp = require('sharp');

const inputImagePath = 'input.jpg';

// 1. 이미지 크기 조정 (리사이즈)
sharp(inputImagePath)
    .resize(500, 500)
    .toFile('output/resized.jpg')
    .then(() => console.log('이미지 크기 조정 완료!'))
    .catch(err => console.error(err));

// 2. 이미지 회전
sharp(inputImagePath)
    .rotate(90)
    .toFile('output/rotated.jpg')
    .then(() => console.log('이미지 회전 완료!'))
    .catch(err => console.error(err));

// 3. 이미지 상하/좌우 반전
sharp(inputImagePath)
    .flip()  // 상하반전
    .flop()  // 좌우반전
    .toFile('output/flipped.jpg')
    .then(() => console.log('이미지 반전 완료!'))
    .catch(err => console.error(err));

// 4. 샤프닝 효과 적용
sharp(inputImagePath)
    .sharpen()
    .toFile('output/sharpened.jpg')
    .then(() => console.log('샤프닝 적용 완료!'))
    .catch(err => console.error(err));

// 5. 블러(흐림) 효과 적용
sharp(inputImagePath)
    .blur(5)  // 흐림 정도 (1~100, 5 이상 권장)
    .toFile('output/blurred.jpg')
    .then(() => console.log('블러 효과 적용 완료!'))
    .catch(err => console.error(err));

// 6. 워터마크 삽입
sharp(inputImagePath)
    .composite([
        { input: 'logo.png', gravity: 'southeast' } // 오른쪽 하단에 배치
    ])
    .toFile('output/watermark.jpg')
    .then(() => console.log('워터마크 삽입 완료!'))
    .catch(err => console.error(err));

// 7. 이미지 합성 (두 이미지 결합)
sharp({
    create: {
        width: 800,
        height: 600,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 } // 투명한 빨간색 배경
    }
})
    .composite([
        { input: inputImagePath, gravity: 'center' }
    ])
    .toFile('output/composite.jpg')
    .then(() => console.log('이미지 합성 완료!'))
    .catch(err => console.error(err));

// 8. 이미지 포맷 변환 (JPEG → PNG)
sharp(inputImagePath)
    .toFormat('png')
    .toFile('output/converted.png')
    .then(() => console.log('이미지 포맷 변환 완료!'))
    .catch(err => console.error(err));

// 9. 품질 조정 및 압축
sharp(inputImagePath)
    .jpeg({ quality: 70 }) // JPEG 품질 70%로 압축
    .toFile('output/compressed.jpg')
    .then(() => console.log('이미지 품질 조정 완료!'))
    .catch(err => console.error(err));

// 10. 이미지 메타데이터 확인
sharp(inputImagePath)
    .metadata()
    .then(metadata => {
        console.log('이미지 메타데이터:', metadata);
    })
    .catch(err => console.error(err));
