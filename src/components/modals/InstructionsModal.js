import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const InstructionsModal = ({ isOpen, onClose, language }) => {
  const instructions = {
    english: [
      "Choose between an easy (1 point) or hard (2 points) word.",
      "Make the sound of the chosen word without using words or gestures.",
      "Sitting on your hands is recommended to avoid gestures.",
      "Your teammates guess the word.",
      "Click on the word if they guess correctly, or 'Skip' to move to the next word.",
      "Skipping penalizes you 5 seconds.",
      "Score as many points as possible in 60 seconds!"
    ],
    spanish: [
      "Elige entre una palabra fácil (1 punto) o difícil (2 puntos).",
      "Haz el sonido de la palabra elegida, sin usar palabras o señas.",
      "Se recomienda sentarse sobre las manos para evitar señas.",
      "Tus compañeros de equipo adivinan la palabra.",
      "Haz clic en la palabra si adivinan correctamente, o 'Saltar' para pasar a la siguiente palabra.",
      "Saltar te penaliza con 5 segundos.",
      "¡Consigue tantos puntos como sea posible en 60 segundos!"
    ]
  };

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
            {instructions[language].map((instruction, index) => (
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