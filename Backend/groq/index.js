const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: "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" });

// Función para obtener la palabra de la IA
function generateRestrictionsText(restrictions) {
  let text = "";

  for (let position in restrictions) {
    for (let letter in restrictions[position]) {
      let count = restrictions[position][letter];

      if (count === 4) {
        text += `La letra "${letter}" está en la posición ${position}.\n`;
      } else if (count === 1) {
        text += `La letra "${letter}" está en la palabra, pero no en la posición ${position}.\n`;
      } else if (count === 0) {
        text += `La letra "${letter}" no está en la palabra.\n`;
      }
    }
  }

  return text;
}

async function getWordFromAI(message, language) {
    //const text = generateRestrictionsText(dictionary);
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: `${message}` }],
            files: [{ file: fs.readFileSync(`../words-${language}.txt`, 'utf8') }],
            model: "llama3-8b-8192"
        });
        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error al obtener la palabra de la IA:", error);
        return ""; // Manejar el error según sea necesario
    }
}

module.exports = { getWordFromAI };
