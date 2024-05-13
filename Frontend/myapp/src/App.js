// App.js
import React, { useEffect, useState } from 'react';
import Irabazi from './irabazi';
import Board from './board';

function App() {
  const [words, setWords] = useState([]);
  const [language, setLanguage] = useState('es'); // Idioma por defecto
  const [selectedWord, setSelectedWord] = useState('');
  const [hasWon, setHasWon] = useState(false); // Nuevo estado para rastrear si el usuario ha ganado


 // useEffect(() => {
   // const fetchWordOfTheDay = async () => {
     // try {
       // const response = await fetch('/word-of-the-day');
        //if (!response.ok) {
          //throw new Error('Error al obtener la palabra del backend');
        //}
        //const data = await response.json();
        //const upperRandomWord = data.wordOfTheDay.toUpperCase();
        //setSelectedWord(upperRandomWord);
      //} catch (error) {
        //console.error(error);
      //}
    //};
    //fetchWordOfTheDay();
 // }, [language]);

 useEffect(() => {
  const fetchWordOfTheDay = async () => {
    try {
      const response = await fetch(`/word-of-the-day?language=${language}`); // Agregar el idioma seleccionado como parámetro de consulta
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

  const handleWin = () => { // Nueva función para manejar cuando el usuario gana
    setHasWon(true);
  };

  return (
    <div className="App">
      {hasWon ? (
        <Irabazi/>
      ) : (
        <>
          <p>Palabra seleccionada: {selectedWord}</p>
          <select onChange={handleLanguageChange}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="eu">Vasco</option>
          </select>
          <Board word={selectedWord} language={language} onWin={handleWin} /> {/* Pasamos handleWin a Board */}
        </>
      )}
    </div>
  );
}

export default App;