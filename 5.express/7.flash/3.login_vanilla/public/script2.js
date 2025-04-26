document.addEventListener("DOMContentLoaded", () => {
    fetch("/flash-messages")
        .then(res => res.json())
        .then(messages => {
            const container = document.getElementById("flash-container");

            if (!messages.length) return;

            messages.forEach(msg => {
                const div = document.createElement("div");
                div.className = `alert alert-${msg.type} alert-dismissible fade show`;
                div.role = "alert";
                div.innerHTML = `
                    ${msg.text}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                container.appendChild(div);
            });
        });
});
