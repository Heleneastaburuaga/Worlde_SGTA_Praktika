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

  const [guesses, setGuesses] = useState({
    0: Array.from({ length: 5 }).fill(""),
    1: Array.from({ length: 5 }).fill(""),
    2: Array.from({ length: 5 }).fill(""),
    3: Array.from({ length: 5 }).fill(""),
    4: Array.from({ length: 5 }).fill(""),
    5: Array.from({ length: 5 }).fill("")
  });
  const [tileColors, setTileColors] = useState({});

  useEffect(() => {
    fetchWordFromAI();
  }, []);
 console.log("Hitza ia: " + wordFromAI)
 const restrictions = {...dictionary};
    console.log("Restrictions: " + JSON.stringify(restrictions));
  const fetchWordFromAI = async () => {
    try {
      const response = await fetch(`/get-word-from-ai?restrictions=${JSON.stringify(restrictions)}`);
      if (!response.ok) {
        throw new Error('Error al obtener la palabra de la IA desde el backend');
      }
      const data = await response.json();
      setWordFromAI(data.word);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("Hitza ia " + wordFromAI)

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
    if(currentTurn === 'ai'){
      try {
        const response = await fetch(`/check-word?word=${guesses[turn - 1].join("").toLowerCase()}&language=${language}`);
        if (!response.ok) {
          throw new Error('Error al verificar la palabra en el backend');
        }
        const data = await response.json();
        const isInDictionary = data.isInDictionary;
    
        if (isInDictionary) {
          setCanProceed(true);
          setTurn(turn + 1);
          setCurrentLetterIndex(0);
          console.log("Turn: " + turn);
          let newDictionary = { ...dictionary };
          let newTileColors = {tileColors };
            Object.values(guesses).forEach((guess, guessIndex) => {
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
          
            if(word === guesses[turn - 1].join("")){
              setCanProceed(false);
              setWin(true);
              onWin(); 
            }
            setCurrentTurn('player');
  
          } else {
            setWordNotFound(true);
            console.log("ez dago hiztegian");
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        console.log("key: " + e.key);
        if (e.key === "Enter") {
          let newGuesses = { ...guesses };
          for (let i = 0; i < wordFromAI.length; i++) {
            newGuesses[turn - 1][i] = wordFromAI[i].toUpperCase();
            
          }
          console.log(newGuesses);
          setGuesses(newGuesses);
          onEnter();
          console.log("enter");
        }
      }
       
      window.addEventListener("keydown", handleKeyDown);
    
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [guesses, turn, currentLetterIndex, canProceed, currentTurn]);
  
    return win && currentTurn === 'ai' ? (
      <Galdu />
    ) : (
      <Main>
        <Header>WORDLE</Header>
        {wordNotFound && <div>PALABRA NO ENCONTRADA</div>}
        <GameSection>
          <TileContainer>
            {Object.values(guesses).map((guess, index) => {
              return (
                <TileRow key={index}>
                  {guess.map((guessChar, guessIndex) => {
                    let color = tileColors[`${index}-${guessIndex}`] === "red" ? "black" : "black";
                    let backgroundColor = tileColors[`${index}-${guessIndex}`] || "white";
                    return (
                      <Tile key={guessIndex} bgColor={backgroundColor} style={{ color: color }}>
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
  