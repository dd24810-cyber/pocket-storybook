import React from 'react';
import { Volume2, Bookmark, Check, X, BookOpen } from 'lucide-react';
import { VocabularyItem } from '../types';
import { speechService } from '../services/speech';

interface WordLookupModalProps {
  item: VocabularyItem | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  storyTitle?: string;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  item,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  storyTitle
}) => {
  if (!isOpen || !item) return null;

  const handleSpeak = () => {
    speechService.speak(item.word, { rate: 0.85 });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Definition for ${item.word}`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white border border-[#B5C3CA]/40 rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden text-[#20313D] transform transition-all animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Amber bookplate header bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E6A653] via-[#FBF0DD] to-[#365C78]" />
        
        {/* Grab bar on mobile */}
        <div className="sm:hidden w-10 h-1 bg-[#B5C3CA]/50 rounded-full mx-auto mt-2.5" />

        <div className="p-6">
          {/* Top row: Word, phonetic, audio button, close */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h3 className="font-serif-book text-2xl font-semibold text-[#20313D] tracking-tight">
                  {item.word}
                </h3>
                {item.partOfSpeech && (
                  <span className="text-xs font-medium text-[#657681] italic">
                    {item.partOfSpeech}
                  </span>
                )}
              </div>
              {item.phonetic && (
                <p className="text-xs font-mono text-[#365C78] mt-0.5 tracking-wide">
                  {item.phonetic}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSpeak}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#365C78] bg-[#E3ECF0] hover:bg-[#365C78] hover:text-white transition-colors cursor-pointer"
                title="Listen to pronunciation"
                aria-label="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meaning */}
          <div className="mb-4">
            <h4 className="text-[11px] font-semibold text-[#657681] uppercase tracking-wider mb-1">
              Definition
            </h4>
            <p className="text-sm text-[#20313D] leading-relaxed">
              {item.meaning}
            </p>
          </div>

          {/* Context / Example */}
          {item.example && (
            <div className="mb-5 p-3.5 bg-[#F1F4F2] rounded-xl border-l-2 border-[#E6A653]">
              <h4 className="text-[11px] font-semibold text-[#657681] uppercase tracking-wider mb-1">
                Story Context
              </h4>
              <p className="font-serif-book text-sm text-[#20313D] italic leading-relaxed">
                “{item.example}”
              </p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#B5C3CA]/20">
            {storyTitle ? (
              <span className="text-xs text-[#657681] truncate max-w-[180px]">
                From: {storyTitle}
              </span>
            ) : (
              <span className="text-xs text-[#657681] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#365C78]" />
                Pocket Reader
              </span>
            )}

            <button
              type="button"
              onClick={onToggleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#356A58] text-white hover:bg-[#2d5849]'
                  : 'bg-[#365C78] text-white hover:bg-[#2c4b63]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>In Word Bank</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 fill-[#E6A653] text-[#E6A653]" />
                  <span>Save to Word Bank</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
