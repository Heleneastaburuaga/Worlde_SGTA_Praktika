import React, { useEffect, useState } from 'react';
import Irabazi from './irabazi';
import Galdu from './galdu';
import {Main, Header, GameSection, TileContainer, TileRow, Tile} from './estiloa';
import "./App.css";

function Board({ word, language, onWin, currentTurn, setCurrentTurn}) {

  const [turn, setTurn] = useState(1);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [canProceed, setCanProceed] = useState(true);
  const [win, setWin] = useState(false);

  const [wordNotFound, setWordNotFound] = useState(false); // Nuevo estado para controlar si la palabra no se encontró

  const [guesses, setGuesses] = useState({
    0: Array.from({ length: 5 }).fill(""),
    1: Array.from({ length: 5 }).fill(""),
    2: Array.from({ length: 5 }).fill(""),
    3: Array.from({ length: 5 }).fill(""),
    4: Array.from({ length: 5 }).fill(""),
    5: Array.from({ length: 5 }).fill("")
  });
  const [tileColors, setTileColors] = useState({}); // New state for tile colors

  //hizkuntza aldatzian board hustu
  useEffect(() => {
    setTurn(1);
    setCurrentLetterIndex(0);
    setCanProceed(true);
    setWin(false);
    setWordNotFound(false);
    setGuesses({
      0: Array.from({ length: 5 }).fill(""),
      1: Array.from({ length: 5 }).fill(""),
      2: Array.from({ length: 5 }).fill(""),
      3: Array.from({ length: 5 }).fill(""),
      4: Array.from({ length: 5 }).fill(""),
      5: Array.from({ length: 5 }).fill("")
    });
    setTileColors({});
  }, [language]);

  function onDelete() {
      let newGuesses = { ...guesses };

    if (currentLetterIndex === 4) {
      if(newGuesses[turn - 1][currentLetterIndex] === ""){
        newGuesses[turn - 1][currentLetterIndex - 1] = "";
        setCurrentLetterIndex(currentLetterIndex - 1);
      } else {
        setCanProceed(true);
        newGuesses[turn - 1][currentLetterIndex] = "";
        setCurrentLetterIndex(currentLetterIndex);
      }
    } else if (currentLetterIndex === 3) {
      newGuesses[turn - 1][currentLetterIndex - 1] = "";
      setCurrentLetterIndex(currentLetterIndex - 1);
    } else if (currentLetterIndex === 2) {
      newGuesses[turn - 1][currentLetterIndex - 1] = "";
      setCurrentLetterIndex(currentLetterIndex - 1);
    } else if (currentLetterIndex === 1) {
      newGuesses[turn - 1][currentLetterIndex - 1] = "";
      setCurrentLetterIndex(currentLetterIndex - 1);
    }

    setGuesses(newGuesses);
    // Al borrar una letra, ocultamos el mensaje "PALABRA NO ENCONTRADA"
    setWordNotFound(false);
  
  }

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

    //comprobar si la palabra esta en el dicionario
    if(currentTurn === 'player'){
    try {
      const response = await fetch(`/check-word?word=${guesses[turn - 1].join("").toLowerCase()}&language=${language}`);
      if (!response.ok) {
        throw new Error('Error al verificar la palabra en el backend');
      }
      const data = await response.json();
      const isInDictionary = data.isInDictionary;
  
      if (isInDictionary) {
        console.log("La palabra existe en el diccionario.");

        setCanProceed(true);
        setTurn(turn + 1);
        setCurrentLetterIndex(0);
        console.log(guesses);

        let newTileColors = { ...tileColors };
        Object.values(guesses).forEach((guess, guessIndex) => {
          let hitzak = countLetters(word);
          guess.forEach((guessChar, charIndex) => {
            let zenbaki = hitzak[guessChar];
            if (guessChar === word[charIndex]) { 
              newTileColors[`${guessIndex}-${charIndex}`] = 'green';
              hitzak[guessChar]--;
            } else if (word.includes(guessChar) && zenbaki > 0) {
              newTileColors[`${guessIndex}-${charIndex}`] = 'yellow';
              hitzak[guessChar]--;
            } else {
              newTileColors[`${guessIndex}-${charIndex}`] = 'white';
            }
          });
        });
        setTileColors(newTileColors); // Update tile colors
        
        //Hitza asmatu badu, mezua pantailaratu
       if(word === guesses[turn - 1].join("")){
          console.log("Zorionak, hitza asmatu duzu!");
          setCanProceed(false); //Ezin du gehiago jokatu partida honetan
          setWin(true);
          console.log("player win "+ win)
          onWin(); 
        }
        setCurrentTurn('ai');
      } else {
        console.log("La palabra no existe en el diccionario.");
        setWordNotFound(true);
        // Aquí puedes agregar lógica adicional, como mostrar un mensaje de error en el frontend.
      }
    } catch (error) {
      console.error(error);
    }
    
  }
  }

  useEffect(() => {
    const allKeys = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "Enter", "Backspace"];

    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (allKeys.includes(e.key) && turn <= 6) {
        if (letter.length === 1 && letter.match(/[A-Z]/i)) {
          if(canProceed&&currentTurn === 'player'){
            let newGuesses = { ...guesses };
            newGuesses[turn - 1][currentLetterIndex] = letter;
            setGuesses(newGuesses);

            if (currentLetterIndex === 4) {
              setCanProceed(false);
            } else {
              setCurrentLetterIndex(currentLetterIndex + 1);
            }
          }
        }else if (e.key === "Backspace" && currentLetterIndex > 0) {
          onDelete();
          return;
        } else if (e.key === "Enter" && !canProceed) {
          onEnter();
          return;
        }else{
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guesses, turn, currentLetterIndex, canProceed, currentTurn]);



return win && currentTurn === 'player' ? (
  <Irabazi />
) : turn === 7 && !win ? (
  <Galdu />
) : (
  <Main>
    <Header>WORDLE</Header>
    {wordNotFound && <div>PALABRA NO ENCONTRADA</div>} {/* Mostrar el mensaje si la palabra no se encontró */}
    <GameSection>
      <TileContainer>
        {Object.values(guesses).map((guess, index) => {
          return (
            <TileRow key={index}>
              {guess.map((guessChar, guessIndex) => {
                let color =
                  tileColors[`${index}-${guessIndex}`] === "green"
                    ? "black"
                    : "black";
                let backgroundColor =
                  tileColors[`${index}-${guessIndex}`] || "white";
                return (
                  <Tile
                    key={guessIndex}
                    bgColor={backgroundColor}
                    style={{ color: color }}
                  >
                    {guessChar}
                  </Tile>
                );
              })}
            </TileRow>
          );
        })}
      </TileContainer>
    </GameSection>
  </Main>
);
}

export default Board;