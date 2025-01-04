const { parentPort, workerData } = require('worker_threads');
const Tesseract = require('tesseract.js');
const path = require('path');

const filePath = workerData.filePath;

Tesseract.recognize(filePath, 'kor+eng', {
    logger: (info) => {
        if (info.status === 'recognizing text') {
            parentPort.postMessage({ progress: info.progress });
        }
    }
}).then(({ data: { text } }) => {
    parentPort.postMessage({ text });
    parentPort.close();
}).catch((error) => {
    parentPort.postMessage({ error });
    parentPort.close();
});
