const backendUrl = "http://172.17.15.98:11434/api/generate";

function addMessage(text, sender) {
    const chatWindow = document.getElementById("chat-window");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "phi",
                prompt: text
            })
        });
        const data = await response.json();
        addMessage(data.response, "bot");
    } catch (err) {
        addMessage("⚠️ Error contacting backend", "bot");
        console.error(err);
    }
}

