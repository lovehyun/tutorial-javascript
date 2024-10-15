const { ipcRenderer } = require('electron');

const openFileButton = document.getElementById('openFile');
const saveFileButton = document.getElementById('saveFile');
const toggleThemeButton = document.getElementById('toggleTheme');
const editor = document.getElementById('editor');
let currentFilePath = null;

// 파일 열기
openFileButton.addEventListener('click', async () => {
    const fileData = await ipcRenderer.invoke('dialog:openFile');
    if (fileData) {
        editor.value = fileData.content;
        currentFilePath = fileData.filePath;
    }
});

// 파일 저장
saveFileButton.addEventListener('click', async () => {
    if (currentFilePath) {
        await ipcRenderer.invoke('dialog:saveFile', editor.value);
    } else {
        const filePath = await ipcRenderer.invoke('dialog:saveFile', editor.value);
        if (filePath) {
            currentFilePath = filePath;
        }
    }
});

// 다크 모드/라이트 모드 전환
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});
