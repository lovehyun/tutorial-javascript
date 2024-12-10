const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 파일 열기 이벤트
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    if (!canceled && filePaths.length > 0) {
        const content = fs.readFileSync(filePaths[0], 'utf-8');
        return { filePath: filePaths[0], content };
    }
    return null;
});

// 파일 저장 이벤트
ipcMain.handle('dialog:saveFile', async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        defaultPath: 'untitled.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
    });

    if (!canceled && filePath) {
        fs.writeFileSync(filePath, data, 'utf-8');
        return filePath;
    }
    return null;
});
