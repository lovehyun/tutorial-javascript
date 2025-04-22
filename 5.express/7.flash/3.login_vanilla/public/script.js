document.addEventListener("DOMContentLoaded", () => {
    fetch("/flash-messages")
        .then(res => res.json())
        .then(messages => {
            const container = document.getElementById("flashContainer");

            messages.forEach(msg => {
                const div = document.createElement("div");
                div.textContent = msg.text;

                // 간단한 색상 처리만
                if (msg.type === "success") {
                    div.style.color = "green";
                } else if (msg.type === "danger" || msg.type === "error") {
                    div.style.color = "red";
                } else {
                    div.style.color = "black";
                }

                container.appendChild(div);
            });
        });
});
