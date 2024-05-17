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

async function getWordFromAI(dictionary) {
    //const text = generateRestrictionsText(dictionary);
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: `Imagínate que estas jugando al juego Wordle, el cual consiste en adivinar una palabra aleatoria de 5 letras. Dame siempre una palabra de 5 letras. Respondeme solo con la palabra de 5 letras en español. Aquí tienes algunas pistas, en estas pistas se indica por cada posicion de la palabra (0,1,2,3,4) que letra es la mas probable de que este en la palabra, pr ejemplo {"0":{"a":2, "b":3}} significara que en la posicion 0(la primera) la letra b sale 3 veces de cada 5 y la letra a 2. Por lo que sera mejor escoger la b ya que es mas probable: ${JSON.stringify(dictionary)}. Importante que sea de cinco letras!` }],
            //messages: [{ role: "system", content: `Imagínate que estas jugando al juego Wordle, el cual consiste en adivinar una palabra aleatoria de 5 letras. Dame siempre una palabra de 5 letras. Respondeme solo con la palabra de 5 letras en español. Aquí tienes algunas pistas : ${text}. Importante que sea de cinco letras!` }],
            model: "llama3-8b-8192"
        });
        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error al obtener la palabra de la IA:", error);
        return ""; // Manejar el error según sea necesario
    }
}

module.exports = { getWordFromAI };
