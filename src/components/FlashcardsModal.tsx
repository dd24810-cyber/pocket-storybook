import React, { useState } from 'react';
import { Volume2, RotateCw, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import { SavedWord } from '../types';
import { speechService } from '../services/speech';

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: SavedWord[];
  onToggleMastered: (word: string) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  words,
  onToggleMastered
}) => {
  const [deck, setDeck] = useState<SavedWord[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    setDeck(words);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words, isOpen]);

  if (!isOpen || deck.length === 0) return null;

  const currentWord = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < deck.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : deck.length - 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.speak(currentWord.word, { rate: 0.85 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vocabulary flashcard study mode"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#B5C3CA]/40 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber top accent */}
        <div className="h-1.5 w-full bg-[#E6A653]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#B5C3CA]/25">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#657681] uppercase tracking-wider">
              Flashcard {currentIndex + 1} of {deck.length}
            </span>
            <button
              type="button"
              onClick={handleShuffle}
              className="text-xs text-[#365C78] hover:underline flex items-center gap-1 cursor-pointer"
              title="Shuffle cards"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Flashcard Stage */}
        <div className="p-6 sm:p-8 flex flex-col items-center">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] p-8 rounded-2xl border-2 border-[#B5C3CA]/50 hover:border-[#365C78] bg-[#F1F4F2] shadow-xs cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-300 relative group"
          >
            {/* Top corner hint */}
            <div className="flex items-center gap-1 text-[11px] text-[#657681] opacity-70 group-hover:opacity-100">
              <RotateCw className="w-3 h-3" />
              <span>Tap card to flip</span>
            </div>

            {/* Content: Front vs Back */}
            {!isFlipped ? (
              <div className="my-auto space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="font-serif-book text-3xl sm:text-4xl font-semibold text-[#20313D]">
                    {currentWord.word}
                  </h2>
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className="w-9 h-9 rounded-full bg-[#E3ECF0] text-[#365C78] hover:bg-[#365C78] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                {currentWord.phonetic && (
                  <p className="font-mono text-sm text-[#365C78]">
                    {currentWord.phonetic}
                  </p>
                )}
                {currentWord.partOfSpeech && (
                  <span className="text-xs text-[#657681] italic block">
                    {currentWord.partOfSpeech}
                  </span>
                )}
              </div>
            ) : (
              <div className="my-auto space-y-4 max-w-sm">
                <div>
                  <span className="text-[11px] font-semibold text-[#657681] uppercase tracking-wider block mb-1">
                    Definition
                  </span>
                  <p className="text-base text-[#20313D] leading-relaxed">
                    {currentWord.meaning}
                  </p>
                </div>
                {currentWord.example && (
                  <div className="pt-2 border-t border-[#B5C3CA]/25">
                    <p className="font-serif-book text-xs text-[#657681] italic">
                      “{currentWord.example}”
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Story attribution */}
            <div className="text-[11px] text-[#657681] truncate max-w-xs">
              {currentWord.storyTitle ? `From: ${currentWord.storyTitle}` : 'Pocket Storybook'}
            </div>
          </div>

          {/* Practice Evaluation Buttons */}
          <div className="w-full flex items-center justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                if (currentWord.mastered) {
                  onToggleMastered(currentWord.word);
                }
                handleNext();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#B5C3CA] text-xs font-semibold text-[#657681] hover:text-[#20313D] hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-[#E6A653]" />
              <span>Needs Practice</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!currentWord.mastered) {
                  onToggleMastered(currentWord.word);
                }
                handleNext();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#356A58] text-white hover:bg-[#2d5849] text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mastered!</span>
            </button>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-[#B5C3CA]/20">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1 text-xs text-[#657681] hover:text-[#20313D] py-1 px-2 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-[#657681] font-mono tabular-nums">
              {currentIndex + 1} / {deck.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 text-xs text-[#657681] hover:text-[#20313D] py-1 px-2 rounded-lg cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
