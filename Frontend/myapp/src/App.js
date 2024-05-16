// App.js
import React, { useEffect, useState } from 'react';
import Irabazi from './irabazi';
import Galdu from './galdu';
import Board from './board';
import BoardAI from './boardAI';

function App() {
  const [words, setWords] = useState([]);
  const [language, setLanguage] = useState('es'); // Idioma por defecto
  const [selectedWord, setSelectedWord] = useState('');
  const [hasWon, setHasWon] = useState(false); // Nuevo estado para rastrear si el usuario ha ganado
  const [currentTurn, setCurrentTurn] = useState('player'); // Nuevo estado para rastrear el turno actual


    //Len zauena hemendik behera
  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const response = await fetch(`/word-of-the-day?language=${language}`);
        if (!response.ok) {
          throw new Error('Error al obtener la palabra del backend');
        }
        const data = await response.json();
        const upperRandomWord = data.wordOfTheDay.toUpperCase();
        setSelectedWord(upperRandomWord);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWordOfTheDay();
  }, [language]);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleWin = () => {
    setHasWon(true);
  };

  return (
    <div className="App">
     {hasWon ? (
  currentTurn === 'ai' ? <Irabazi /> : <Galdu />
) : (
  <>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <p>Palabra seleccionada: {selectedWord}</p>
        <select onChange={handleLanguageChange}>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
          <option value="eu">Vasco</option>
        </select>
        <Board word={selectedWord} language={language} onWin={handleWin} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} />
      </div>
      <div>
        <p>AI jugando...</p>
        <BoardAI word={selectedWord} language={language} onWin={handleWin} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn}/>
      </div>
    </div>
  </>
)}
    </div>
  );
}

export default App;