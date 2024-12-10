// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // preload 스크립트 사용
            nodeIntegration: true // Node.js API 사용 허용
        }
    });

    mainWindow.loadFile('index.html'); // 렌더러 프로세스에 HTML 파일 로드
}

// 앱이 준비되면 창을 생성
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 모든 창이 닫히면 애플리케이션 종료 (macOS 제외)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
