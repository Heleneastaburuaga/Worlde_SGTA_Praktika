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

// Función para buscar una palabra en una lista de palabras
function searchWord(word, wordList) {
    const lowercaseWord = word.toLowerCase();
    return wordList.includes(lowercaseWord);
}

function getLastWord(phrase) {
    const words = phrase.split(' ');
    return words[words.length - 1];
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
    //let restrictions = {"0":{"a":0,"b":3},"1":{"d":1},"2":{"e":0}};
    let words;
    words = readWordsFromFile('words-es.txt');
    const dictionary= countLetterOccurrences(words, restrictions);
    const word = await getWordFromAI(dictionary);
    const hitza = getLastWord(word);
    res.json({ word, dictionary });
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});