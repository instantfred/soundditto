import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Info } from "lucide-react"
import englishWords from './lib/englishWords';
import spanishWords from './lib/spanishWords';
import localization from './lib/localization';
import Footer from './components/ui/Footer';
import InstructionsModal from './components/modals/InstructionsModal';

const GAME_DURATION = 90; // Game duration in seconds
const SKIP_PENALTY = 5; // Time penalty for skipping in seconds

const SounddittoGame = () => {
  const [gameState, setGameState] = useState('waiting');
  const [currentWords, setCurrentWords] = useState({ easy: '', hard: '' });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [language, setLanguage] = useState('en');
  const [availableWords, setAvailableWords] = useState([]);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);

  const t = (key) => localization[language][key];

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimerEnabled) {
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
  }, [gameState, isTimerEnabled]);

  const startGame = () => {
    const words = language === 'en' ? [...englishWords] : [...spanishWords];
    setAvailableWords(words);
    setGameState('playing');
    setScore(0);
    if (isTimerEnabled) {
      setTimeLeft(GAME_DURATION);
    }
    nextWord(words);
  };

  const endGame = () => {
    setGameState('finished');
  };

  const nextWord = (words = availableWords) => {
    if (words.length <= 1) {
      setGameState('finished');
      return;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWords(words[randomIndex]);
    setAvailableWords(words.filter((_, index) => index !== randomIndex));
  };

  const handleSkip = () => {
    if (isTimerEnabled) {
      setTimeLeft((prevTime) => Math.max(prevTime - SKIP_PENALTY, 0));
    }
    nextWord();
  };

  const handleGotIt = (difficulty) => {
    setScore((prevScore) => prevScore + (difficulty === 'easy' ? 1 : 2));
    nextWord();
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'es' : 'en');
  };

  const toggleTimer = () => {
    setIsTimerEnabled(prevState => !prevState);
  };

  const renderLanguageToggle = () => (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <span className={`font-semibold ${language === 'en' ? 'text-pink-500' : 'text-gray-400'}`}>EN</span>
      <Switch
        checked={language === 'es'}
        onCheckedChange={toggleLanguage}
        disabled={gameState !== 'waiting'}
        className="bg-white border-2 border-gray-300 data-[state=checked]:bg-white data-[state=unchecked]:bg-white"
      />
      <span className={`font-semibold ${language === 'es' ? 'text-yellow-500' : 'text-gray-400'}`}>ES</span>
    </div>
  );

  const renderTimerToggle = () => (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <span className="font-semibold text-gray-600">{t('timer')}</span>
      <Switch
        checked={isTimerEnabled}
        onCheckedChange={toggleTimer}
        disabled={gameState !== 'waiting'}
        className="bg-white border-2 border-gray-300 data-[state=checked]:bg-white data-[state=unchecked]:bg-white"
      />
    </div>
  );

  const openInstructions = () => setIsInstructionsOpen(true);
  const closeInstructions = () => setIsInstructionsOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col items-center justify-center p-4">
      <div className="flex-grow flex items-center justify-center p-4 w-full">
        <Card className="w-full max-w-md mx-auto shadow-2xl hover:scale-105 transition-transform duration-300 bg-white rounded-3xl overflow-hidden">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
                Soundditto
              </h1>
              <Button
                size="icon"
                onClick={openInstructions}
                className="text-yellow-500 hover:text-yellow-600 transition-colors"
              >
                <Info className="h-6 w-6" />
              </Button>
            </div>
            {gameState === 'waiting' && (
              <>
                {renderLanguageToggle()}
                {renderTimerToggle()}
              </>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {gameState === 'waiting' && (
              <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300 animate-pulse">
                {t('startGame')}
              </Button>
            )}
            {gameState === 'playing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-600">
                    {t('chooseWord')}
                  </p>
                  <div className="flex justify-between mt-4 space-x-4">
                    <Button onClick={() => handleGotIt('easy')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                      <span className="block">
                        <span className="text-xs">{t('easy')} (1pt)</span>
                        <span className="block text-lg font-bold">{currentWords.easy}</span>
                      </span>
                    </Button>
                    <Button onClick={() => handleGotIt('hard')} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-6 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                      <span className="block">
                        <span className="text-xs">{t('hard')} (2pts)</span>
                        <span className="block text-lg font-bold">{currentWords.hard}</span>
                      </span>
                    </Button>
                  </div>
                </div>
                <Button onClick={handleSkip} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                  {t('skip')}
                </Button>
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-indigo-600">
                    {t('score')} <span className="ml-2 text-2xl">{score}</span>
                  </p>
                  {isTimerEnabled ? (
                    <p className="text-lg font-semibold text-pink-600">
                      {t('time')} <span className="ml-2 text-2xl">{timeLeft}s</span>
                    </p>
                  ) : (
                    <Button onClick={endGame} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                      {t('endGame')}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {gameState === 'finished' && (
              <div className="text-center space-y-6">
                <p className="text-2xl font-bold text-indigo-600">
                  {t('gameOver')}
                </p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {t('finalScore')} {score}
                </p>
                <Button onClick={startGame} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300">
                  {t('playAgain')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      <InstructionsModal isOpen={isInstructionsOpen} onClose={closeInstructions} language={language} />
    </div>
  );
};

export default SounddittoGame;
