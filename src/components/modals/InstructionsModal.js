import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const instructions = {
  en: [
    "Choose a word from either the 'Easy' or 'Hard' category.",
    "Make the sound of the chosen word without using actual words.",
    "Your team must guess the word based on your sound.",
    "Score 1 point for easy words, 2 points for hard words.",
    "Skip difficult words, but beware of the time penalty!",
    "Race against the clock or play until you've gone through all words.",
    "Have fun and get creative with your sounds!"
  ],
  es: [
    "Elige una palabra de la categoría 'Fácil' o 'Difícil'.",
    "Haz el sonido de la palabra elegida sin usar palabras reales.",
    "Tu equipo debe adivinar la palabra basándose en tu sonido.",
    "Gana 1 punto por palabras fáciles, 2 puntos por palabras difíciles.",
    "Salta las palabras difíciles, ¡pero cuidado con la penalización de tiempo!",
    "Compite contra el reloj o juega hasta que hayas pasado por todas las palabras.",
    "¡Diviértete y sé creativo con tus sonidos!"
  ]
};

const InstructionsModal = ({ isOpen, onClose, language }) => {
  const currentInstructions = instructions[language] || instructions.en;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {language === 'english' ? 'How to Play' : 'Cómo Jugar'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {currentInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </DialogDescription>
        <div className="mt-6">
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white rounded-full"
          >
            {language === 'english' ? 'Close' : 'Cerrar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;