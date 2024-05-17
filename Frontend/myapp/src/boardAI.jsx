import React, { useEffect, useState } from 'react';
import Galdu from './galdu';
import {Main, Header, GameSection, TileContainer, TileRow, Tile} from './estiloa';
import "./App.css";

function Board({ word, language, onWin, currentTurn, setCurrentTurn}) {

  const [turn, setTurn] = useState(1);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [canProceed, setCanProceed] = useState(true);
  const [win, setWin] = useState(false);
  const [wordNotFound, setWordNotFound] = useState(false);
  const [wordFromAI, setWordFromAI] = useState('');
  const [dictionary, setDictionary] = useState({});

  const [guesses2, setGuesses2] = useState({
    0: Array.from({ length: 5 }).fill(""),
    1: Array.from({ length: 5 }).fill(""),
    2: Array.from({ length: 5 }).fill(""),
    3: Array.from({ length: 5 }).fill(""),
    4: Array.from({ length: 5 }).fill(""),
    5: Array.from({ length: 5 }).fill("")
  });
  const [tileColors, setTileColors] = useState({});

  const restrictions = {...dictionary};

  useEffect(() => {
    setTurn(1);
    setCurrentLetterIndex(0);
    setCanProceed(true);
    setWin(false);
    setWordNotFound(false);
    setGuesses2({
      0: Array.from({ length: 5 }).fill(""),
      1: Array.from({ length: 5 }).fill(""),
      2: Array.from({ length: 5 }).fill(""),
      3: Array.from({ length: 5 }).fill(""),
      4: Array.from({ length: 5 }).fill(""),
      5: Array.from({ length: 5 }).fill("")
    });
    setTileColors({});
    setDictionary({});
  }, [language]);

  useEffect(() => {
    if(currentTurn === 'ai'){
      console.log("Turno de la IA: " + currentTurn);
      console.log("Restrictions2: " + JSON.stringify(restrictions));
      onEnter();
    }
  }, [currentTurn]);

  function countLetters(string) {
    const counts = {};
    for (let i = 0; i < string.length; i++) {
      const letter = string[i];
      if (counts[letter]) {
        counts[letter]++;
      } else {
        counts[letter] = 1;
      }
    }
    return counts;
  }

  async function onEnter() {
    let hitza = "" ;
    if(currentTurn === 'ai'){
      try {
        const response = await fetch(`/get-word-from-ai?restrictions=${JSON.stringify(restrictions)}&language=${language}`);
        if (!response.ok) {
          throw new Error('Error al obtener la palabra de la IA desde el backend');
        }
        const data = await response.json();
        hitza = data.word;
        console.log("Hitza ia: " + hitza);
        console.log(data.dictionary)
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await fetch(`/check-word?word=${hitza}&language=${language}`);
        if (!response.ok) {
          throw new Error('Error al verificar la palabra en el backend');
        }
        const data = await response.json();
        const isInDictionary = data.isInDictionary;
    
        if (isInDictionary) {
          let newGuesses = { ...guesses2 };
          for (let i = 0; i < hitza.length; i++) {
            newGuesses[turn - 1][i] = hitza[i].toUpperCase();
          }
          console.log(newGuesses);
          setGuesses2(newGuesses);

          if(word === hitza){
            setCanProceed(false);
            setWin(true);
            onWin(); 
            console.log("ia win "+ win)
          } else {
            setCanProceed(true);
            setTurn(turn + 1);
            setCurrentLetterIndex(0);
            console.log("Turn: " + turn);
            let newDictionary = { ...dictionary };
            let newTileColors = {tileColors };
              Object.values(guesses2).forEach((guess, guessIndex) => {
                let hitzak = countLetters(word);
                guess.forEach((guessChar, charIndex) => {
                  let zenbaki = hitzak[guessChar];
                  if (guessChar === word[charIndex]) { 
                    newDictionary["0"] = { ...newDictionary["0"], [guessChar]: charIndex };
                  } else if (word.includes(guessChar) && zenbaki > 0) {
                    newDictionary["1"] = { ...newDictionary["1"], [guessChar]: charIndex };
                  } else if (!word.includes(guessChar)) {
                    newDictionary["2"] = { ...newDictionary["2"], [guessChar]: 1 };
                  }
                });
              });
              setDictionary(newDictionary);
              setTileColors(newTileColors);
              setCurrentTurn('player');
            }
          } else {
            setWordNotFound(true);
            console.log("ez dago hiztegian");
            onEnter();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  console.log("Restrictions3: " + JSON.stringify(restrictions));

    return win && currentTurn === 'ai' ? (
      <Galdu />
    ) : (
      <Main>
         <p>Letras adivinadas: {Object.keys(dictionary["0"] || {}).length}</p>
          <p>Letras en la posición incorrecta: {Object.keys(dictionary["1"] || {}).length}</p>
      </Main>
    );
  }
  
  export default Board;
  