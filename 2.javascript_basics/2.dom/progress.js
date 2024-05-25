document.addEventListener("DOMContentLoaded", function () {
    const timeInput = document.getElementById("timeInput");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const progressBar = document.getElementById("progress");

    let interval;
    let duration;

    function startProgress() {
        if (interval) clearInterval(interval); // Clear any existing intervals

        duration = parseInt(timeInput.value);
        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid number of seconds.");
            return;
        }

        let timePassed = 0;
        progressBar.style.width = "0%"; // Reset progress bar

        interval = setInterval(() => {
            timePassed++;
            let progress = (timePassed / duration) * 100;
            progressBar.style.width = `${progress}%`;

            if (timePassed >= duration) {
                clearInterval(interval);
            }
        }, 1000);
    }

    function resetProgress() {
        if (interval) clearInterval(interval); // Clear any existing intervals
        progressBar.style.width = "0%";
        timeInput.value = "";
    }

    startButton.addEventListener("click", startProgress);
    resetButton.addEventListener("click", resetProgress);
});
