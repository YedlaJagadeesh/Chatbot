const backendUrl = "http://172.17.15.98:5000/generate";

function addMessage(sender, text) {
    const chatWindow = document.getElementById("chat-window");
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    try {
        const res = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text })
        });

        const data = await res.json();
        addMessage("bot", data.response);
    } catch (err) {
        addMessage("bot", "⚠ Error connecting to server.");
        console.error(err);
    }
}
