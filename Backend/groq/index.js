const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: "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" });

// Función para obtener la palabra de la IA
async function getWordFromAI(dictionary) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Imaginate que estamos jugando al juego Wordle. ¿Me podrías dar una palabra de 5 letras? Respondeme solo con la palabra de 5 letras en español. Aquí tienes algunas pistas: ${JSON.stringify(dictionary)}` }],
            model: "llama3-8b-8192"
        });
        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error al obtener la palabra de la IA:", error);
        return ""; // Manejar el error según sea necesario
    }
}

module.exports = { getWordFromAI };
