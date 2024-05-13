// Hiztegia.js
import axios from 'axios';

export async function getWords(language) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let words = [];

for (let letter of alphabet) {
  try {
    let url;
    if (language === 'eu') {
      // Aquí debes poner la URL y los parámetros correctos para la API de HizkuntzaZerbitzuak
      url = `https://api.hizkuntzazerbitzuak.eus/words?letter=${letter}`;
    } else {
      url = `https://api.datamuse.com/words?sp=${letter}*&max=1000&md=d`;
      if (language !== 'en') {
        url += `&v=${language}`;
      }
    }
    const response = await axios.get(url);
    let fiveLetterWords;
    if (language === 'eu') {
      // Aquí debes poner el código correcto para extraer las palabras de la respuesta de la API de HizkuntzaZerbitzuak
      fiveLetterWords = response.data.words.filter(word => word.length === 5);
    } else {
      fiveLetterWords = response.data
        .map(wordObj => wordObj.word)
        .filter(word => word.length === 5);
    }
    words = words.concat(fiveLetterWords);
  } catch (error) {
    console.error(error);
  }
}

  return words;
}