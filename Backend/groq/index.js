const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: "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" });

// Función para obtener la palabra de la IA
function processDictionary(dictionary) {
    const text = "";
    for (let i = 0; i < 5; i++) {
      const position = dictionary[i];
      text += `La letra más común en la posición ${i} es "${Object.keys(position)[0]}" con una probabilidad de ${position[Object.keys(position)[0]]}. `;
    }
    return text;
}

async function getWordFromAI(dictionary) {
    try {
        const text = processDictionary(dictionary);
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: `Eres un jugador experto de wordle que tiene que adivinar una palabra de 5 letras, para ello tienes las siguientes pistas ${text}` }],
            model: "llama3-8b-8192"
        });
        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error al obtener la palabra de la IA:", error);
        return ""; // Manejar el error según sea necesario
    }
}

module.exports = { getWordFromAI };
