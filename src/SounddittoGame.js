import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const GAME_DURATION = 60; // Game duration in seconds
const SKIP_PENALTY = 5; // Time penalty for skipping in seconds

const englishWords = [
  "Cat", "Dog", "Bird", "Fish", "Elephant",
  "Car", "Bike", "Train", "Plane", "Boat",
  "Apple", "Banana", "Orange", "Grape", "Pear",
  "Red", "Blue", "Green", "Yellow", "Purple",
  "Sun", "Moon", "Star", "Cloud", "Rain"
];

const spanishWords = [
  "Gato", "Perro", "Pájaro", "Pez", "Elefante",
  "Coche", "Bicicleta", "Tren", "Avión", "Barco",
  "Manzana", "Plátano", "Naranja", "Uva", "Pera",
  "Rojo", "Azul", "Verde", "Amarillo", "Morado",
  "Sol", "Luna", "Estrella", "Nube", "Lluvia"
];

const SounddittoGame = () => {
  const [gameState, setGameState] = useState('waiting');
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [language, setLanguage] = useState('english');
  const [availableWords, setAvailableWords] = useState([]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameState('finished');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    const words = language === 'english' ? [...englishWords] : [...spanishWords];
    setAvailableWords(words);
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
  };

  const nextWord = () => {
    if (availableWords.length <= 1) {
      setGameState('finished');
      return;
    }
    const newWords = availableWords.filter(word => word !== currentWord);
    const randomIndex = Math.floor(Math.random() * newWords.length);
    setCurrentWord(newWords[randomIndex]);
    setAvailableWords(newWords);
  };

  const handleSkip = () => {
    setTimeLeft((prevTime) => Math.max(prevTime - SKIP_PENALTY, 0));
    nextWord();
  };

  const handleGotIt = () => {
    setScore((prevScore) => prevScore + 1);
    nextWord();
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'english' ? 'spanish' : 'english');
  };

  const renderLanguageToggle = () => (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <span className={`font-semibold ${language === 'english' ? 'text-pink-500' : 'text-gray-400'}`}>EN</span>
      <Switch
        checked={language === 'spanish'}
        onCheckedChange={toggleLanguage}
        disabled={gameState !== 'waiting'}
        className="bg-white border-2 border-gray-300 data-[state=checked]:bg-white data-[state=unchecked]:bg-white"
      />
      <span className={`font-semibold ${language === 'spanish' ? 'text-yellow-500' : 'text-gray-400'}`}>ES</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl hover:scale-105 transition-transform duration-300 bg-white rounded-3xl overflow-hidden">
        <CardHeader className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent p-6">
          Soundditto
          {gameState === 'waiting' && renderLanguageToggle()}
        </CardHeader>
        <CardContent className="p-6">
          {gameState === 'waiting' && (
            <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">
              {language === 'english' ? 'Start Game' : 'Iniciar Juego'}
            </Button>
          )}
          {gameState === 'playing' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-600">
                  {language === 'english' ? 'Current Word:' : 'Palabra Actual:'}
                </p>
                <p className="text-4xl font-bold mt-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-bounce">
                  {currentWord}
                </p>
              </div>
              <div className="flex justify-between space-x-4">
                <Button onClick={handleSkip} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                  {language === 'english' ? 'Skip' : 'Saltar'}
                </Button>
                <Button onClick={handleGotIt} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                  {language === 'english' ? 'Got it!' : '¡Lo tengo!'}
                </Button>
              </div>
              <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <p className="text-lg font-semibold text-indigo-600">
                  {language === 'english' ? 'Score:' : 'Puntuación:'} 
                  <span className="ml-2 text-2xl">{score}</span>
                </p>
                <p className="text-lg font-semibold text-pink-600">
                  {language === 'english' ? 'Time:' : 'Tiempo:'} 
                  <span className="ml-2 text-2xl">{timeLeft}s</span>
                </p>
              </div>
            </div>
          )}
          {gameState === 'finished' && (
            <div className="text-center space-y-6">
              <p className="text-2xl font-bold text-indigo-600">
                {language === 'english' ? 'Game Over!' : '¡Juego Terminado!'}
              </p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {language === 'english' ? 'Final Score:' : 'Puntuación Final:'} {score}
              </p>
              <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                {language === 'english' ? 'Play Again' : 'Jugar de Nuevo'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SounddittoGame;