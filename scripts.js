const backendUrl = "http://172.17.15.98:5000/generate"; // MCP URL

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
            body: JSON.stringify({ prompt: text })
        });

        const data = await response.json();
        addMessage(data.reply, "bot");
    } catch (err) {
        addMessage("⚠️ Error contacting backend", "bot");
        console.error(err);
    }
}
