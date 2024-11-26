const audio = document.getElementById('background-audio');
const toggleButton = document.getElementById('toggle-sound');

// 재생 및 정지 토글
toggleButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        toggleButton.textContent = 'Pause Sound';
    } else {
        audio.pause();
        toggleButton.textContent = 'Play Sound';
    }
});
