const backendUrl = "http://172.17.15.98:11434/api/generate";

function addMessage(text, sender) {
    const chatWindow = document.getElementById("chat-window");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msgDiv;
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const botDiv = addMessage("", "bot"); // create empty bot message

    try {
        const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "phi",
                prompt: text
            })
        });

        if (!response.body) {
            botDiv.textContent = "⚠️ Streaming not supported";
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                botDiv.textContent += decoder.decode(value);
                const chatWindow = document.getElementById("chat-window");
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        }
    } catch (err) {
        botDiv.textContent = "⚠️ Error contacting backend";
        console.error(err);
    }
}
