const express = require('express');
const fs = require('fs');
const { getWordFromAI } = require('./groq/index.js'); // Importar la función desde el archivo separado

const app = express();

// Función para leer palabras desde un archivo de texto
function readWordsFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split(',').map(word => word.trim());
}

function countLetterOccurrences(dictionary, restrictions) {
    const counts = {};
   
    for (const word of dictionary) {
      for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        
        // Comprobar las restricciones
        if (restrictions["2"] && restrictions["2"][letter] !== undefined) continue; //Esa letra no esta
        if (restrictions["1"] && restrictions["1"][letter] === i) continue; //La posicion erronea
        if (restrictions["0"] && Object.values(restrictions["0"]).includes(i) && restrictions["0"][letter] !== i) continue; //Ha acertado
  
        // Incrementar el conteo
        if (!counts[i]) {
          counts[i] = {};
        }
        if (!counts[i][letter]) {
          counts[i][letter] = 0;
        }
        counts[i][letter]++;
      }
    }
  
    return counts;
  }

function getLastWord(phrase) {
    const words = phrase.trim().split(' ');
    return words[words.length - 1];
}

function searchWord(word, wordList) {
    const lowercaseWord = word.toLowerCase();
    return wordList.includes(lowercaseWord);
}

/*
function getMostSimilarWord(wordList, targetWord) {
    let maxMatches = 0;
    let mostSimilarWord = '';

    for (let word of wordList) {
        let matches = 0;
        for (let letter of word) {
            if (targetWord.includes(letter)) {
                matches++;
            }
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            mostSimilarWord = word;
        }
    }

    return mostSimilarWord || null;
}
*/
/*
function getMostSimilarWord(words, restrictions) {
    let maxMatches = 0;
    let mostSimilarWord = '';
  
    for (let word of words) {
      let matches = 0;
      let wordArray = word.split('');
      let restrictionArray = Object.values(restrictions);
  
      for (let i = 0; i < wordArray.length; i++) {
        if (restrictionArray[0] && wordArray[i] === Object.keys(restrictions[0])[0]) {
          matches++;
        }
        if (restrictionArray[1] && wordArray[i] === Object.keys(restrictions[1])[0]) {
          matches++;
        }
        if (restrictionArray[2] && !wordArray.includes(Object.keys(restrictions[2])[0])) {
          matches++;
        }
      }
  
      if (matches > maxMatches) {
        maxMatches = matches;
        mostSimilarWord = word;
      }
    }
  
    return mostSimilarWord;
  }
*/
  function getMostSimilarWord(words, restrictions) {
    return words.find(word => {
        for (const [pos, letters] of Object.entries(restrictions)) {
            const index = parseInt(pos, 10);

            // Check for positions with fixed letters
            if (letters[0] !== undefined) {
                if (word[index] !== Object.keys(letters)[0]) {
                    return false;
                }
            }

            // Check for positions with included letters
            if (letters[1] !== undefined) {
                const includedLetters = Object.keys(letters).filter(letter => letters[letter] > 0);
                if (!includedLetters.some(letter => word.includes(letter))) {
                    return false;
                }
            }

            // Check for positions with excluded letters
            if (letters[2] !== undefined) {
                const excludedLetters = Object.keys(letters).filter(letter => letters[letter] === 0);
                if (excludedLetters.some(letter => word.includes(letter))) {
                    return false;
                }
            }
        }
        return true;
    });
}
// Función para obtener una palabra aleatoria de una lista de palabras
function getRandomWord(wordList) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}

// Lee las palabras del diccionario para diferentes idiomas
const wordsEn = readWordsFromFile('words-en.txt');
const wordsEs = readWordsFromFile('words-es.txt');
const wordsEu = readWordsFromFile('words-eu.txt');

// Ruta para obtener la palabra del día
app.get("/word-of-the-day", (req, res) => {
    const { language } = req.query;
    let words;
    if (language === 'en') {
        words = readWordsFromFile('words-en.txt');
    } else if (language === 'eu') {
        words = readWordsFromFile('words-eu.txt');
    } else {
        words = readWordsFromFile('words-es.txt'); // Por defecto, utilizar el diccionario en español
    }
    const randomWord = getRandomWord(words);
    res.json({ wordOfTheDay: randomWord });
});

// Ruta para verificar si una palabra está en el diccionario
app.get("/check-word", (req, res) => {
    const { word, language } = req.query;
    let words;
    if (language === 'en') {
        words = readWordsFromFile('words-en.txt');
    } else if (language === 'eu') {
        words = readWordsFromFile('words-eu.txt');
    } else {
        words = readWordsFromFile('words-es.txt'); // Por defecto, utilizar el diccionario en español
    }
    const isInDictionary = searchWord(word, words);
    res.json({ isInDictionary });
});

app.get("/get-word-from-ai", async (req, res) => {
    const language = req.query.language;
    let restrictions = JSON.parse(req.query.restrictions);
    let words;
    if (language === 'en') {
        words = readWordsFromFile('words-en.txt');
    } else if (language === 'eu') {
        words = readWordsFromFile('words-eu.txt');
    } else {
        words = readWordsFromFile('words-es.txt');
    }
    const dictionary= countLetterOccurrences(words, restrictions);


    let message;
    if (language === 'en') {
        message = `Imagine you are playing the game Wordle, which consists of guessing a random 5-letter word. Always give me a 5-letter word. Answer me only with the 5-letter word in English. Here you have some clues, in these clues it is indicated for each position of the word (0,1,2,3,4) which letter is the most likely to be in the word, for example {“0”:{“a”:2, “b”:3}} will mean that in position 0(the first one) the letter b appears 3 times out of 5 and the letter a 2. So it will be better to choose the b since it is more likely: ${JSON.stringify(dictionary)}. It is important that it is five letters long! The word must be in the language ${language}! Give a word in English that has 5 letters. The ${dictionary} give you the letters that can be in the word in that position, so make words based in dicctionary. Don't give the same word more than two times and please have the restrictions in mind. Please give words with have sense and are in the dictionary. You are giving all the times the word house and horse, please don't say always the same words!`;
    } else if (language === 'eu') {
        //message = `Wordle jokoan jolasten ari zara, 5 letrako ausazko hitz bat asmatzean datzana. Eman beti 5 letrako hitz bat euskaraz. Erantzun niri bakarrik 5 hizkiko hitzarekin eta hitza euskeraz izan behar da. Hona hemen arrasto batzuk, pista hauetan hitzaren posizio bakoitzeko adierazten da (0,1,2,3,4) zein letra da hitzean honek izan dezakeen probabilitaterik handiena, adibidez {"0": {"a": 2, "b": 3}} 0 posizioan (lehena) b letra 3 aldiz ateratzen da 5etik eta letra 2 aldiz. Beraz, hobe izango da b aukera aukeratzea, litekeena baita: ${JSON.stringify (dictionary)}. Hitzik bururatzen ez bazaizu, fitxategiko bat aukeratu dezakezu. Ez eman testu bat, bakarrik 5 letra duen hitza, ez dut nahi testu batekin erantzutea. Garrantzitsua da bost letrakoa izatea! Hitza ${language} hizkuntzan egon behar da! Mesedez, emaidazu euskerazko hitza bat, 5 letra duena, erantzunean bakarri hitza agetu behar da.`;
        message = `give me a word in basque with 5 letters, please the answer has to be only the word with 5 letters, no text, the word has to be in basque. Here you have some clues, in these clues it is indicated for each position of the word (0,1,2,3,4) which letter is the most likely to be in the word, for example {“0”:{“a”:2, “b”:3}} will mean that in position 0(the first one) the letter b appears 3 times out of 5 and the letter a 2. So it will be better to choose the b since it is more likely: ${JSON.stringify(dictionary)}. Your answer is a text and I ask you only the word. Please give only the word, no a text. ONLY the word.`;
    } else {
        message = `Imagínate que estas jugando al juego Wordle, el cual consiste en adivinar una palabra aleatoria de 5 letras. 
        Dame siempre una palabra de 5 letras. Respondeme solo con la palabra de 5 letras en español. Dame la palabra en letras minúsculas. 
        Aquí tienes algunas pistas, en estas pistas se indica por cada posicion de la palabra (0,1,2,3,4) 
        que letra es la mas probable de que este en la palabra, por ejemplo {"0":{"a":2, "b":3}} significara 
        que en la posicion 0(la primera) la letra b sale 3 veces de cada 5 y la letra a 2. Ten en cuenta las 
        restricciones, ${restrictions}, las que estan seguidas del 0, son las letras que has adivinado su posición. 
        Busca palabras que contengan en esa posición esa letra. Las que van seguidas del 1, son las letras que has adivinado, 
        pero que están en posiciónes incorrectas. Coge la restricción anterior y busca tambien palabras que tengas estas letras. 
        Las letras que van seguidas al 2, significa que esas letras no están en la palabra que buscas, evita buscar una palabra con esas letras. 
        Por lo que sera mejor escoger la b ya que es mas probable: ${JSON.stringify(dictionary)}. Por favor, haz caso a las restricciones. Importante que sea de cinco letras! La palabra tiene 
        que ser del idioma ${language}!`;
    }

    //let hitza;
    let word = null;

    while (word === null) {
        word = await getWordFromAI(message, language);
        //word = getMostSimilarWord(words, restrictions);
    }

    res.json({ word, dictionary });
 });

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});