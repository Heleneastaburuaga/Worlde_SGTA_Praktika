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
        if (restrictions["2"] && restrictions["2"][letter] !== undefined) continue;
        if (restrictions["1"] && restrictions["1"][letter] === i) continue;
        if (restrictions["0"] && Object.values(restrictions["0"]).includes(i) && restrictions["0"][letter] !== i) continue;
  
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
   let restrictions = JSON.parse(req.query.restrictions);
let words;
words = readWordsFromFile('words-es.txt');
const dictionary= countLetterOccurrences(words, restrictions);
let hitza;
let word = null;

while (word === null) {
    hitza = await getWordFromAI(restrictions);
    word = getMostSimilarWord(words, hitza);
}

res.json({ word, dictionary });
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});