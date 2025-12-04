const backendUrl = "http://172.17.15.98:11434/api/generate"; // your Ollama Phi API

// Function to add messages to chat window
function addMessage(text, sender) {
    const chatWindow = document.getElementById("chat-window");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return msgDiv; // return div for streaming updates
}

// Streaming sendMessage function
async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user"); // add user message
    input.value = "";

    const botDiv = addMessage("", "bot"); // create empty bot message for streaming

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

// Bind Enter key and button click
document.querySelector(".chat-input button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
