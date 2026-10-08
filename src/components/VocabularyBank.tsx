import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  CheckCircle2,
  Trash2,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useReading } from '../context/ReadingContext';
import { speechService } from '../services/speech';
import { FlashcardsModal } from './FlashcardsModal';

export const VocabularyBank: React.FC = () => {
  const {
    savedWords,
    removeWordFromBank,
    toggleWordMastered,
    setActiveTab,
    selectStory
  } = useReading();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'learning' | 'mastered'>('all');
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);

  // Filter words
  const filteredWords = savedWords.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.storyTitle && item.storyTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterMode === 'learning') return !item.mastered;
    if (filterMode === 'mastered') return item.mastered;
    return true;
  });

  const masteredCount = savedWords.filter((w) => w.mastered).length;
  const learningCount = savedWords.length - masteredCount;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#B5C3CA]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#365C78] uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-[#E6A653] text-[#E6A653]" />
            <span>Reader’s Lexicon</span>
          </div>
          <h1 className="font-serif-book text-3xl font-semibold tracking-tight text-[#20313D]">
            Vocabulary Bank
          </h1>
          <p className="text-xs text-[#657681] mt-1">
            Words saved from stories. Listen to pronunciation and review with flashcards.
          </p>
        </div>

        {/* Action Button: Launch Flashcards */}
        {savedWords.length > 0 && (
          <button
            type="button"
            onClick={() => setIsFlashcardsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#365C78] hover:bg-[#2c4b63] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Layers className="w-4 h-4 text-[#E6A653]" />
            <span>Practice Flashcards ({savedWords.length})</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
        {/* Segmented Filter Control (Allowed functional buttons) */}
        <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] rounded-xl border border-[#B5C3CA]/40 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#E3ECF0] text-[#365C78] font-semibold'
                : 'text-[#657681] hover:text-[#20313D]'
            }`}
          >
            All Words ({savedWords.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('learning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterMode === 'learning'
                ? 'bg-[#E3ECF0] text-[#365C78] font-semibold'
                : 'text-[#657681] hover:text-[#20313D]'
            }`}
          >
            Needs Practice ({learningCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('mastered')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterMode === 'mastered'
                ? 'bg-[#E3ECF0] text-[#365C78] font-semibold'
                : 'text-[#657681] hover:text-[#20313D]'
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#657681] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved words..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#B5C3CA]/40 text-xs text-[#20313D] placeholder-[#657681] focus:outline-none focus:ring-1 focus:ring-[#365C78]"
          />
        </div>
      </div>

      {/* Vocabulary List */}
      {filteredWords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-12 text-center shadow-xs">
          <BookOpen className="w-10 h-10 text-[#B5C3CA] mx-auto mb-3" />
          <h3 className="font-serif-book text-lg font-semibold text-[#20313D] mb-1">
            {savedWords.length === 0 ? 'Your Word Bank is Empty' : 'No Matching Words Found'}
          </h3>
          <p className="text-xs text-[#657681] max-w-sm mx-auto mb-5">
            {savedWords.length === 0
              ? 'Read stories in the library and tap any vocabulary word to save it here for spaced review and practice.'
              : 'Try searching for a different keyword or switch filter tabs.'}
          </p>
          {savedWords.length === 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className="px-4 py-2 bg-[#365C78] text-white text-xs font-semibold rounded-xl hover:bg-[#2c4b63] transition-colors cursor-pointer"
            >
              Explore Stories
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif-book text-xl font-semibold text-[#20313D]">
                        {item.word}
                      </h3>
                      {item.partOfSpeech && (
                        <span className="text-xs text-[#657681] italic">
                          {item.partOfSpeech}
                        </span>
                      )}
                    </div>
                    {item.phonetic && (
                      <p className="text-xs font-mono text-[#365C78] mt-0.5">
                        {item.phonetic}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => speechService.speak(item.word, { rate: 0.85 })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#365C78] hover:bg-[#E3ECF0] transition-colors cursor-pointer"
                      title="Pronounce word"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeWordFromBank(item.word)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove from Word Bank"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#20313D] leading-relaxed mb-3">
                  {item.meaning}
                </p>

                {item.example && (
                  <div className="p-2.5 bg-[#F1F4F2]/70 rounded-lg border-l-2 border-[#E6A653] mb-3">
                    <p className="font-serif-book text-xs text-[#20313D]/90 italic">
                      “{item.example}”
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#B5C3CA]/20 flex items-center justify-between">
                {item.storyId && item.storyTitle ? (
                  <button
                    type="button"
                    onClick={() => selectStory(item.storyId!)}
                    className="text-[11px] text-[#365C78] hover:underline truncate max-w-[170px] cursor-pointer"
                    title={`Open ${item.storyTitle}`}
                  >
                    📖 {item.storyTitle}
                  </button>
                ) : (
                  <span className="text-[11px] text-[#657681]">Pocket Reader</span>
                )}

                <button
                  type="button"
                  onClick={() => toggleWordMastered(item.word)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    item.mastered
                      ? 'bg-[#356A58]/10 text-[#356A58] hover:bg-[#356A58]/20'
                      : 'bg-[#F1F4F2] text-[#657681] hover:text-[#20313D]'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.mastered ? 'text-[#356A58]' : 'text-[#B5C3CA]'}`} />
                  <span>{item.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flashcards Practice Modal */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        words={filteredWords.length > 0 ? filteredWords : savedWords}
        onToggleMastered={toggleWordMastered}
      />
    </div>
  );
};
