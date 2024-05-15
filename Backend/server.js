const express = require('express');
const fs = require('fs');

const app = express();

// Función para leer palabras desde un archivo de texto
function readWordsFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split(',').map(word => word.trim());
}

// Función para buscar una palabra en una lista de palabras
function searchWord(word, wordList) {
    const lowercaseWord = word.toLowerCase();
    return wordList.includes(lowercaseWord);
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

/*
app.post("/generate-word", async (req, res) => {
    const regex = req.body.regex;
    const word = await generateWord(regex);
    res.json({ word });
  });
  */

app.post('/generate-word', async (req, res) => {
    /*
    console.log("Buenas")
    try {
      const regex = req.body.regex;
      const word = await generateWord(regex);
      res.json({ word });
      console.log("Hola" + word)
    } catch (error) {
      console.error('Error generating word:', error);
      res.status(500).json({ error: 'Error generating word' });
    }
*/
  const regex = JSON.parse(req.body);
  const regexStr = regex.regex;
  const word = await generateWord(regexStr);
  res.json({ word });
  });


/*
app.get('/v1/word', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
});

*/
// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});