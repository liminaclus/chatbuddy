document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message");
    const chatLog = document.getElementById("chat-log");

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = messageInput.value;
        appendMessage("user", message);
        messageInput.value = "";

        // Show animated ellipsis
        appendMessage("bot", "<span class='ellipsis'></span>");

        fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `message=${encodeURIComponent(message)}`,
        })
        .then((response) => response.json())
        .then((data) => {
            const reply = data.message;

            // Remove ellipsis message
            chatLog.removeChild(chatLog.lastChild);

            appendMessage("bot", reply);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageElement.innerHTML = message;

        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
