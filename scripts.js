// Replace this with your ngrok URL
const backendUrl = "https://finespun-endamoebic-slyvia.ngrok-free.dev/api/generate";

// Optional CORS proxy for GitHub Pages (testing only)
const proxyUrl = "https://corsproxy.io/?"; // you can remove this if CORS headers are set

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
    input.disabled = true; // disable input while bot is typing

    const botDiv = addMessage("", "bot");
    
    // Blinking cursor while streaming
    let cursorInterval = setInterval(() => {
        if (!botDiv.textContent.endsWith("|")) {
            botDiv.textContent += "|";
        } else {
            botDiv.textContent = botDiv.textContent.slice(0, -1);
        }
    }, 500);

    try {
        const response = await fetch(proxyUrl + backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: "phi", prompt: text })
        });

        if (!response.body) {
            botDiv.textContent = "⚠️ Streaming not supported";
            clearInterval(cursorInterval);
            input.disabled = false;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        botDiv.textContent = ""; // clear before streaming

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
    } finally {
        clearInterval(cursorInterval); // stop cursor
        input.disabled = false;
        input.focus();
    }
}

// Send message on Enter key
document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});
