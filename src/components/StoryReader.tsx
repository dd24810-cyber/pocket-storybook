import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Sparkles,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  X,
  Repeat,
  Compass,
  ChevronDown,
  ChevronUp,
  Clock,
  Timer,
  Type
} from 'lucide-react';
import { Story, VocabularyItem, FontSize } from '../types';
import { useReading } from '../context/ReadingContext';
import { lookupWord } from '../services/dictionary';
import { WordLookupModal } from './WordLookupModal';
import { ReadingSettingsDrawer } from './ReadingSettingsDrawer';
import { ComprehensionQuiz } from './ComprehensionQuiz';

export type SpeechPlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

/**
 * Direct window.speechSynthesis wrapper for paragraph narration
 * Handles voice selection, utterance lifecycle, boundary word tracking, and play/pause/stop toggling
 */
function useParagraphSpeechSynthesis(
  rate: number,
  onParagraphCompleted?: (index: number) => void
) {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>('idle');
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize and select highest quality English voice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const synth = window.speechSynthesis;

      const pickVoice = () => {
        const available = synth.getVoices();
        voicesRef.current = available;
        const natural = available.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Samantha') ||
              v.name.includes('Google US English') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen') ||
              v.name.includes('Serena'))
        );
        selectedVoiceRef.current = natural || available.find((v) => v.lang.startsWith('en')) || available[0] || null;
      };

      pickVoice();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = pickVoice;
      }
    }
  }, []);

  // Stop speech when hook unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;
    setActiveParagraphIndex(null);
    setPlaybackState('stopped');
    setActiveCharIndex(null);
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && playbackState === 'playing') {
        window.speechSynthesis.pause();
        setPlaybackState('paused');
      }
    }
  }, [playbackState]);

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (playbackState === 'paused') {
        window.speechSynthesis.resume();
        setPlaybackState('playing');
      }
    }
  }, [playbackState]);

  const play = useCallback(
    (index: number, text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('window.speechSynthesis is not supported in this browser.');
        return;
      }

      const synth = window.speechSynthesis;
      synth.cancel(); // Stop prior playback

      setActiveParagraphIndex(index);
      setPlaybackState('playing');
      setActiveCharIndex(0);

      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoiceRef.current) {
        utterance.voice = selectedVoiceRef.current;
      }
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setActiveParagraphIndex(index);
        setPlaybackState('playing');
      };

      utterance.onpause = () => {
        setPlaybackState('paused');
      };

      utterance.onresume = () => {
        setPlaybackState('playing');
      };

      utterance.onboundary = (event: SpeechSynthesisEvent) => {
        if (event.name === 'word' || event.charIndex !== undefined) {
          setActiveCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        currentUtteranceRef.current = null;
        setActiveCharIndex(null);
        setPlaybackState('idle');
        onParagraphCompleted?.(index);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('SpeechSynthesis utterance error:', e.error);
        }
        currentUtteranceRef.current = null;
        setActiveCharIndex(null);
        setActiveParagraphIndex(null);
        setPlaybackState('idle');
      };

      currentUtteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [rate, onParagraphCompleted]
  );

  /**
   * Speaker Icon Button Toggle Handler
   * Toggles play/pause/stop for the specified paragraph
   */
  const toggleParagraph = useCallback(
    (index: number, text: string) => {
      if (activeParagraphIndex === index) {
        if (playbackState === 'playing') {
          pause();
        } else if (playbackState === 'paused') {
          resume();
        } else {
          play(index, text);
        }
      } else {
        // Different paragraph selected: play it immediately
        play(index, text);
      }
    },
    [activeParagraphIndex, playbackState, pause, resume, play]
  );

  return {
    activeParagraphIndex,
    playbackState,
    activeCharIndex,
    isSupported,
    play,
    pause,
    resume,
    stop,
    toggleParagraph
  };
}

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  onSelectStory: (id: string) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  onBack,
  onSelectStory
}) => {
  const {
    progressMap,
    toggleBookmark,
    updateParagraphProgress,
    markStoryCompleted,
    saveQuizResult,
    savedWords,
    saveWordToBank,
    removeWordFromBank,
    isWordSaved,
    theme,
    fontSize,
    setFontSize,
    fontStyle,
    highlightVocab,
    audioSpeed,
    setAudioSpeed,
    stories,
    recordReadingSeconds,
    todayReadingSeconds,
    dailyGoalMinutes
  } = useReading();

  // Progress for this story
  const storyProgress = progressMap[story.id] || {
    storyId: story.id,
    paragraphIndex: 0,
    completed: false,
    bookmarked: false,
    lastReadAt: new Date().toISOString()
  };

  const isBookmarked = storyProgress.bookmarked;
  const isCompleted = storyProgress.completed;

  // Selected word for dictionary lookup modal
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Settings drawer
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Continuous playback toggle
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [isPrimerExpanded, setIsPrimerExpanded] = useState<boolean>(true);

  // Reading timer (tracks active duration on this story and today's practice)
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  useEffect(() => {
    setSessionSeconds(0);
    const timer = setInterval(() => {
      // Pause timer when browser window/tab is hidden or manually paused
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }
      if (isTimerPaused) {
        return;
      }
      setSessionSeconds((prev) => prev + 1);
      recordReadingSeconds(1, story.id);
    }, 1000);

    return () => clearInterval(timer);
  }, [story.id, recordReadingSeconds, isTimerPaused]);

  // Total time spent on this story
  const storyTimeSpent = (storyProgress.timeSpentSeconds || sessionSeconds);

  const formatTimeSpent = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Speech completion callback
  const handleParagraphCompleted = useCallback(
    (finishedIndex: number) => {
      if (finishedIndex === story.narrative.length - 1) {
        markStoryCompleted(story.id, true);
      }
      if (continuousMode && finishedIndex + 1 < story.narrative.length) {
        setTimeout(() => {
          speech.play(finishedIndex + 1, story.narrative[finishedIndex + 1]);
          updateParagraphProgress(story.id, finishedIndex + 1);
        }, 400);
      }
    },
    [continuousMode, story.id, story.narrative, markStoryCompleted, updateParagraphProgress]
  );

  // Initialize window.speechSynthesis wrapper
  const speech = useParagraphSpeechSynthesis(audioSpeed, handleParagraphCompleted);

  // Stop speech when navigating away from this story
  useEffect(() => {
    return () => {
      speech.stop();
    };
  }, [story.id, speech]);

  // Visual reading progress percentage (0 - 100)
  const [readingProgress, setReadingProgress] = useState<number>(() => {
    if (storyProgress.completed) return 100;
    const total = story.narrative.length;
    if (total === 0) return 0;
    return Math.min(100, Math.round(((storyProgress.paragraphIndex) / total) * 100));
  });

  // Track scroll position through the narrative container and sync with paragraph audio
  useEffect(() => {
    if (isCompleted) {
      setReadingProgress(100);
      return;
    }

    const calculateProgress = () => {
      const narrativeEl = document.getElementById('story-narrative-container');
      const total = story.narrative.length;

      let scrollPct = 0;
      if (narrativeEl) {
        const rect = narrativeEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = rect.height;
        // Calculate progress as user scrolls through the narrative paragraphs
        const currentScrolled = windowHeight - rect.top;
        if (currentScrolled > 0 && totalHeight > 0) {
          scrollPct = Math.min(100, Math.max(0, Math.round((currentScrolled / (totalHeight + 120)) * 100)));
        }
      }

      // Also compute paragraph progress based on saved progress and active audio paragraph
      const pIndex = speech.activeParagraphIndex !== null ? speech.activeParagraphIndex : storyProgress.paragraphIndex;
      const paragraphPct = total > 0 ? Math.min(100, Math.round(((pIndex + (speech.playbackState === 'playing' ? 1 : 0)) / total) * 100)) : 0;

      const finalPct = Math.min(100, Math.max(scrollPct, paragraphPct));
      setReadingProgress(finalPct);
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    calculateProgress();
    return () => {
      window.removeEventListener('scroll', calculateProgress);
    };
  }, [isCompleted, story.narrative.length, storyProgress.paragraphIndex, speech.activeParagraphIndex, speech.playbackState]);

  // Clean words set for quick vocabulary identification
  const vocabWordsSet = new Set(
    story.vocabulary.map((v) => v.word.toLowerCase().replace(/[^a-z'-]/g, ''))
  );

  const handleWordClick = (rawWord: string) => {
    const item = lookupWord(rawWord, story.vocabulary);
    setSelectedWord(item);
    setIsModalOpen(true);
  };

  /**
   * Speaker icon click for a specific paragraph
   */
  const handleParagraphSpeakerClick = (index: number, text: string) => {
    updateParagraphProgress(story.id, index);
    speech.toggleParagraph(index, text);
  };

  /**
   * Replay active paragraph
   */
  const replayCurrentParagraph = () => {
    if (speech.activeParagraphIndex !== null) {
      speech.play(speech.activeParagraphIndex, story.narrative[speech.activeParagraphIndex]);
    }
  };

  /**
   * Jump between paragraphs
   */
  const skipParagraph = (delta: number) => {
    const nextIdx = (speech.activeParagraphIndex !== null ? speech.activeParagraphIndex : 0) + delta;
    if (nextIdx >= 0 && nextIdx < story.narrative.length) {
      updateParagraphProgress(story.id, nextIdx);
      speech.play(nextIdx, story.narrative[nextIdx]);
    }
  };

  /**
   * Master read-aloud toggle for whole story
   */
  const handleMasterAudioToggle = () => {
    if (speech.playbackState === 'playing') {
      speech.pause();
    } else if (speech.playbackState === 'paused') {
      speech.resume();
    } else {
      const startIdx = storyProgress.paragraphIndex < story.narrative.length ? storyProgress.paragraphIndex : 0;
      setContinuousMode(true);
      updateParagraphProgress(story.id, startIdx);
      speech.play(startIdx, story.narrative[startIdx]);
    }
  };

  // Find next story in collection
  const currentIndex = stories.findIndex((s) => s.id === story.id);
  const nextStory = currentIndex !== -1 && currentIndex + 1 < stories.length ? stories[currentIndex + 1] : null;

  // Reading Theme styles
  const themeClasses: Record<string, { bg: string; text: string; pageBg: string; border: string }> = {
    paper: {
      bg: 'bg-[#F1F4F2]',
      pageBg: 'bg-[#FFFFFF]',
      text: 'text-[#20313D]',
      border: 'border-[#B5C3CA]/40'
    },
    sepia: {
      bg: 'bg-[#F4EFE2]',
      pageBg: 'bg-[#FDFBF7]',
      text: 'text-[#2D2721]',
      border: 'border-[#DECDB7]'
    },
    night: {
      bg: 'bg-[#10171D]',
      pageBg: 'bg-[#17222B]',
      text: 'text-[#E2E8F0]',
      border: 'border-slate-800'
    },
    white: {
      bg: 'bg-[#F8FAFC]',
      pageBg: 'bg-[#FFFFFF]',
      text: 'text-slate-900',
      border: 'border-slate-200'
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.paper;

  // Font size classes
  const fontSizeClasses: Record<string, string> = {
    sm: 'text-base sm:text-lg leading-relaxed',
    base: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    lg: 'text-xl sm:text-2xl leading-loose',
    xl: 'text-2xl sm:text-3xl leading-loose'
  };

  const isAnyAudioActive =
    (speech.playbackState === 'playing' || speech.playbackState === 'paused') &&
    speech.activeParagraphIndex !== null;

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-200 pb-36`}>
      {/* Sticky Reader Top Bar */}
      <div className={`sticky top-0 z-30 ${currentTheme.pageBg} border-b ${currentTheme.border} backdrop-blur-md shadow-2xs`}>
        {/* Visual Reading Progress Bar at the Very Top */}
        <div
          className="w-full h-1 bg-[#E3ECF0] overflow-hidden"
          role="progressbar"
          aria-valuenow={readingProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Story reading progress: ${readingProgress}%`}
        >
          <div
            className={`h-full transition-all duration-300 ease-out ${
              readingProgress >= 100
                ? 'bg-[#356A58]'
                : 'bg-gradient-to-r from-[#365C78] via-[#E6A653] to-[#365C78]'
            }`}
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-medium text-[#657681] hover:text-[#20313D] transition-colors py-2 pr-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Library</span>
          </button>

          {/* Center Story Title & Level with Reading Progress & Today's Timer */}
          <div className="text-center truncate px-2">
            <h1 className="font-serif-book text-sm sm:text-base font-semibold text-[#20313D] truncate">
              {story.title}
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#365C78] font-medium tracking-wide">
              <span>{story.level.charAt(0).toUpperCase() + story.level.slice(1)}</span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span className="flex items-center gap-1 text-[#20313D] font-mono tabular-nums" title="Time spent on this story">
                <Clock className="w-3 h-3 text-[#E6A653]" />
                <span>Story: {formatTimeSpent(storyTimeSpent)}</span>
              </span>
              <span aria-hidden="true" className="hidden sm:inline text-[#B5C3CA]">·</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[#356A58] font-mono tabular-nums" title="Total time practiced today">
                <span>Today: {formatTimeSpent(todayReadingSeconds)}</span>
              </span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span className="font-mono tabular-nums text-[#657681] font-normal">{readingProgress}% read</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Font Size Toggle (Small, Medium, Large) */}
            <div
              className="flex items-center bg-[#E3ECF0]/80 p-0.5 rounded-lg border border-[#B5C3CA]/40 shadow-2xs"
              role="group"
              aria-label="Story text font size toggle"
            >
              {[
                { id: 'sm', label: 'Small', char: 'A-', title: 'Small font size' },
                { id: 'base', label: 'Medium', char: 'A', title: 'Medium font size' },
                { id: 'lg', label: 'Large', char: 'A+', title: 'Large font size' }
              ].map((opt) => {
                const isActive = fontSize === opt.id || (opt.id === 'lg' && fontSize === 'xl');
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFontSize(opt.id as FontSize)}
                    className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-[#365C78] font-bold shadow-2xs'
                        : 'text-[#657681] hover:text-[#20313D] hover:bg-white/50'
                    }`}
                    title={opt.title}
                    aria-pressed={isActive}
                  >
                    <span className="font-serif-book font-bold">{opt.char}</span>
                    <span className="hidden lg:inline text-[11px] font-normal">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Master Narration Button */}
            <button
              type="button"
              onClick={handleMasterAudioToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                speech.playbackState === 'playing'
                  ? 'bg-[#E6A653] text-white shadow-xs'
                  : speech.playbackState === 'paused'
                  ? 'bg-[#FBF0DD] text-[#365C78] border border-[#E6A653]'
                  : 'bg-[#E3ECF0] text-[#365C78] hover:bg-[#365C78] hover:text-white'
              }`}
              title={speech.playbackState === 'playing' ? 'Pause narration' : 'Listen to story'}
              aria-label={speech.playbackState === 'playing' ? 'Pause narration' : 'Listen to story'}
            >
              {speech.playbackState === 'playing' ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden md:inline">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {speech.playbackState === 'paused' ? 'Resume' : 'Listen All'}
                  </span>
                </>
              )}
            </button>

            {/* Reading Settings Drawer Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-black/5 transition-colors cursor-pointer"
              title="Reading display settings"
              aria-label="Reading display settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacious Reading Page Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <article
          className={`relative ${currentTheme.pageBg} ${currentTheme.border} border rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-12 md:p-16 transition-colors`}
        >
          {/* Slim Amber Bookmark Ribbon pinned to top right */}
          <button
            type="button"
            onClick={() => toggleBookmark(story.id)}
            title={isBookmarked ? 'Story is bookmarked (Tap to remove)' : 'Tap to bookmark this page'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this story'}
            className={`cursor-pointer transition-all duration-300 ${
              isBookmarked
                ? 'amber-bookmark-ribbon hover:brightness-110'
                : 'amber-bookmark-ribbon-inactive hover:bg-[#E6A653]/60'
            }`}
          />

          {/* Reading Page Header: Unboxed metadata */}
          <header className="mb-8 pb-6 border-b border-[#B5C3CA]/25">
            <div className="flex items-center gap-2 text-xs text-[#657681] font-medium mb-3">
              <span className="font-semibold text-[#365C78]">
                {story.level.toUpperCase()}
              </span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span>{story.minutes} min read</span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span>{story.narrative.length} paragraphs</span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span>{story.vocabulary.length} key words</span>
            </div>

            <h1 className="font-serif-book text-3xl sm:text-4xl font-semibold tracking-tight text-[#20313D] mb-3">
              {story.title}
            </h1>

            <p className="text-sm text-[#657681] italic">
              {story.scene}
            </p>

            {/* Instruction & Font Size Accessibility Bar */}
            <div className="mt-4 pt-3 border-t border-[#B5C3CA]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#657681]">
              <span className="flex items-center gap-1.5 text-[#365C78] font-medium">
                <Volume2 className="w-3.5 h-3.5 text-[#E6A653]" />
                <span>Tap the speaker icon next to any paragraph to listen</span>
              </span>

              {/* Font Size Accessibility Toggle */}
              <div className="flex items-center gap-1.5 font-sans">
                <span className="text-[11px] text-[#657681] font-medium flex items-center gap-1">
                  <Type className="w-3 h-3 text-[#365C78]" />
                  <span>Font size:</span>
                </span>
                <div
                  className="inline-flex items-center bg-[#F1F4F2] p-0.5 rounded-lg border border-[#B5C3CA]/40 shadow-2xs"
                  role="group"
                  aria-label="Story text font size options"
                >
                  {[
                    { id: 'sm', label: 'Small' },
                    { id: 'base', label: 'Medium' },
                    { id: 'lg', label: 'Large' }
                  ].map((opt) => {
                    const isActive = fontSize === opt.id || (opt.id === 'lg' && fontSize === 'xl');
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFontSize(opt.id as FontSize)}
                        className={`px-2.5 py-0.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-[#365C78] font-bold shadow-2xs'
                            : 'text-[#657681] hover:text-[#20313D]'
                        }`}
                        aria-pressed={isActive}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reading Timer & Today's Practice Shelf */}
            <div className="mt-4 pt-3 border-t border-[#B5C3CA]/20 font-sans">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#E3ECF0]/40 border border-[#B5C3CA]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white text-[#365C78] border border-[#B5C3CA]/30 flex items-center justify-center shrink-0 shadow-2xs">
                    <Clock className="w-4 h-4 text-[#E6A653]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C78] flex items-center gap-1">
                        <Timer className="w-3 h-3 text-[#E6A653]" />
                        Reading Timer
                      </span>
                      {!isTimerPaused ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#356A58] bg-[#356A58]/10 px-1.5 py-0.5 rounded-md font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#356A58] animate-pulse" />
                          Tracking
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.5 rounded-md font-medium">
                          <Pause className="w-2.5 h-2.5 fill-current" />
                          Paused
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xs text-[#657681]">Time on this story:</span>
                      <span className="font-mono font-bold text-sm text-[#20313D] tabular-nums">
                        {formatTimeSpent(storyTimeSpent)}
                      </span>
                      <span className="text-[11px] text-[#657681]">
                        (target ~{story.minutes}m)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Today's Practice Time & Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#B5C3CA]/20">
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#365C78] block">
                      Practiced Today
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-mono font-bold text-sm text-[#356A58] tabular-nums">
                        {formatTimeSpent(todayReadingSeconds)}
                      </span>
                      <span className="text-[11px] text-[#657681]">
                        / {dailyGoalMinutes}m goal
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTimerPaused(!isTimerPaused)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      isTimerPaused
                        ? 'bg-[#E6A653] text-white border-[#E6A653] hover:bg-[#d99742]'
                        : 'bg-white text-[#20313D] border-[#B5C3CA]/40 hover:bg-slate-50'
                    }`}
                    title={isTimerPaused ? 'Resume reading timer' : 'Pause reading timer'}
                    aria-label={isTimerPaused ? 'Resume reading timer' : 'Pause reading timer'}
                  >
                    {isTimerPaused ? (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Pause</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* In-Article Reading Progress Bar */}
            <div className="mt-4 pt-3 border-t border-[#B5C3CA]/20 font-sans">
              <div className="flex items-center justify-between text-xs text-[#657681] mb-1.5">
                <span className="font-medium text-[#20313D] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E6A653]" />
                  <span>Story Reading Progress</span>
                </span>
                <span className="font-mono tabular-nums text-[#365C78] font-semibold">
                  {readingProgress}% completed
                </span>
              </div>
              <div
                className="w-full h-1.5 bg-[#E3ECF0] rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={readingProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Story reading progress: ${readingProgress}%`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${
                    readingProgress >= 100
                      ? 'bg-[#356A58]'
                      : 'bg-gradient-to-r from-[#365C78] via-[#E6A653] to-[#365C78]'
                  }`}
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          </header>

          {/* Key Themes & Story Primer Section */}
          <section
            aria-label="Story overview and key themes"
            className="mb-10 rounded-2xl bg-[#F1F4F2]/75 border border-[#B5C3CA]/40 border-l-4 border-l-[#E6A653] overflow-hidden shadow-2xs font-sans transition-all"
          >
            {/* Primer Header / Toggle Bar */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-[#B5C3CA]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#E3ECF0] text-[#365C78] flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#365C78]">
                    Reader’s Primer · Before You Read
                  </div>
                  <h2 className="text-xs sm:text-sm font-semibold text-[#20313D]">
                    Summary & Key Themes
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPrimerExpanded(!isPrimerExpanded)}
                className="flex items-center gap-1 text-xs text-[#657681] hover:text-[#20313D] py-1 px-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                aria-expanded={isPrimerExpanded}
                aria-label={isPrimerExpanded ? "Collapse story primer" : "Expand story primer"}
              >
                <span className="hidden sm:inline">{isPrimerExpanded ? 'Hide' : 'Show Primer'}</span>
                {isPrimerExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Primer Body */}
            {isPrimerExpanded && (
              <div className="p-4 sm:p-5 pt-3 space-y-4">
                {/* Concise Narrative Summary */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#657681] block mb-1">
                    Story Summary
                  </span>
                  <p className="font-serif-book text-sm sm:text-base text-[#20313D] leading-relaxed">
                    {story.summary || story.scene}
                  </p>
                </div>

                {/* Key Themes: Zero-Pill discipline (unboxed text with typographic separators) */}
                {story.keyThemes && story.keyThemes.length > 0 && (
                  <div className="pt-3 border-t border-[#B5C3CA]/25">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#657681] block mb-1.5">
                      Key Themes to Notice
                    </span>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1.5 text-xs text-[#20313D]">
                      {story.keyThemes.map((themeItem, tIdx) => (
                        <React.Fragment key={tIdx}>
                          {tIdx > 0 && <span aria-hidden="true" className="text-[#B5C3CA]">·</span>}
                          <span className="font-medium text-[#365C78]">
                            {themeItem}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pedagogical Language & Learning Focus */}
                {story.learningFocus && (
                  <div className="pt-3 border-t border-[#B5C3CA]/20 flex items-start gap-2 text-xs text-[#657681]">
                    <span className="font-semibold text-[#365C78] shrink-0">
                      Language Focus:
                    </span>
                    <span className="text-[#20313D]/90">{story.learningFocus}</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Narrative Paragraphs with Speaker Icon Button Next to Each Paragraph */}
          <div
            id="story-narrative-container"
            className={`space-y-8 sm:space-y-10 ${
              fontStyle === 'serif' ? 'font-serif-book' : 'font-sans'
            } ${fontSizeClasses[fontSize]} ${currentTheme.text}`}
          >
            {story.narrative.map((paragraph, pIdx) => {
              const isThisParagraphActive = speech.activeParagraphIndex === pIdx;
              const isThisPlaying = isThisParagraphActive && speech.playbackState === 'playing';
              const isThisPaused = isThisParagraphActive && speech.playbackState === 'paused';
              const isSavedProgress = storyProgress.paragraphIndex === pIdx;

              // Break paragraph into tokens so user can tap ANY word
              const tokens = paragraph.split(/(\s+)/);
              let runningCharOffset = 0;

              return (
                <div
                  key={pIdx}
                  className={`group relative p-3 sm:p-5 rounded-2xl border transition-all duration-300 ${
                    isThisParagraphActive
                      ? 'bg-[#FBF0DD]/80 border-[#E6A653] shadow-xs ring-1 ring-[#E6A653]/40'
                      : 'border-transparent hover:border-[#B5C3CA]/30 hover:bg-black/2'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4.5">
                    {/* Speaker Icon Button Next to Each Paragraph */}
                    <div className="shrink-0 pt-0.5 flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleParagraphSpeakerClick(pIdx, paragraph)}
                        aria-label={
                          isThisPlaying
                            ? `Pause narration for paragraph ${pIdx + 1}`
                            : isThisPaused
                            ? `Resume narration for paragraph ${pIdx + 1}`
                            : `Play narration for paragraph ${pIdx + 1}`
                        }
                        title={
                          isThisPlaying
                            ? 'Pause narration'
                            : isThisPaused
                            ? 'Resume narration'
                            : `Play paragraph ${pIdx + 1}`
                        }
                        className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                          isThisPlaying
                            ? 'bg-[#E6A653] text-white hover:bg-[#d4943f] ring-2 ring-[#E6A653]/50 scale-105'
                            : isThisPaused
                            ? 'bg-[#FBF0DD] text-[#365C78] border-2 border-[#E6A653] hover:bg-[#F5E6CC]'
                            : 'bg-[#E3ECF0] text-[#365C78] hover:bg-[#365C78] hover:text-white border border-[#B5C3CA]/40'
                        }`}
                      >
                        {isThisPlaying ? (
                          <div className="flex items-center justify-center relative">
                            {/* Speaker Icon with Pause/Stop State */}
                            <VolumeX className="w-5 h-5 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
                          </div>
                        ) : isThisPaused ? (
                          <Play className="w-4 h-4 fill-current ml-0.5 text-[#365C78]" />
                        ) : (
                          <Volume2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                        )}
                      </button>

                      {/* Paragraph Number Marker */}
                      <span className="text-[10px] font-sans font-medium text-[#657681] tabular-nums">
                        ¶ {pIdx + 1}
                      </span>
                    </div>

                    {/* Paragraph Narrative Prose */}
                    <div className="flex-1 min-w-0">
                      {/* Active narration banner */}
                      {isThisParagraphActive && (
                        <div className="flex items-center justify-between mb-2 text-xs font-sans text-[#365C78]">
                          <span className="flex items-center gap-1.5 font-semibold">
                            <span className={`w-2 h-2 rounded-full ${isThisPlaying ? 'bg-[#E6A653] animate-pulse' : 'bg-[#657681]'}`} />
                            {isThisPlaying ? 'Narrating paragraph' : 'Audio paused'} ({audioSpeed}×)
                          </span>
                          <button
                            type="button"
                            onClick={speech.stop}
                            className="text-[11px] text-[#657681] hover:text-red-600 transition-colors cursor-pointer"
                          >
                            Stop
                          </button>
                        </div>
                      )}

                      <p className={`${pIdx === 0 ? 'book-drop-cap' : ''} leading-relaxed`}>
                        {tokens.map((token, tIdx) => {
                          const tokenStart = runningCharOffset;
                          const tokenEnd = runningCharOffset + token.length;
                          runningCharOffset = tokenEnd;

                          if (/^\s+$/.test(token)) {
                            return <span key={tIdx}>{token}</span>;
                          }

                          const cleanWord = token.toLowerCase().replace(/[^a-z'-]/g, '');
                          const isKeyVocab = vocabWordsSet.has(cleanWord);

                          // Real-time boundary highlighting when this paragraph is speaking
                          const isCurrentlySpoken =
                            isThisPlaying &&
                            speech.activeCharIndex !== null &&
                            speech.activeCharIndex >= tokenStart &&
                            speech.activeCharIndex <= tokenEnd;

                          return (
                            <span
                              key={tIdx}
                              onClick={() => handleWordClick(cleanWord)}
                              className={`cursor-pointer rounded-xs transition-all duration-150 inline-block hover:text-[#365C78] hover:bg-[#E3ECF0]/60 ${
                                isCurrentlySpoken
                                  ? 'bg-[#E6A653]/35 text-[#20313D] font-medium ring-1 ring-[#E6A653]/50 rounded-xs'
                                  : ''
                              } ${
                                isKeyVocab && highlightVocab
                                  ? 'border-b-2 border-[#E6A653] font-medium text-[#365C78]'
                                  : ''
                              }`}
                              title="Tap word for definition"
                            >
                              {token}
                            </span>
                          );
                        })}
                      </p>

                      {/* Bookmark placement indicator if saved at this paragraph */}
                      {isBookmarked && isSavedProgress && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#E6A653] font-medium font-sans">
                          <Bookmark className="w-3 h-3 fill-[#E6A653]" />
                          <span>Reading bookmark placed at Paragraph {pIdx + 1}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End of Story Action Section */}
          <div className="mt-14 pt-8 border-t border-[#B5C3CA]/30 space-y-8 font-sans">
            {/* Mark as Complete Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#E3ECF0]/50 border border-[#B5C3CA]/30">
              <div>
                <h3 className="font-serif-book text-lg font-semibold text-[#20313D]">
                  {isCompleted ? 'Story Completed' : 'Finished Reading?'}
                </h3>
                <p className="text-xs text-[#657681]">
                  {isCompleted
                    ? 'Congratulations! You read all paragraphs of this story.'
                    : 'Mark this story as completed to record your progress.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => markStoryCompleted(story.id, !isCompleted)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-[#356A58] text-white hover:bg-[#2d5849]'
                    : 'bg-[#365C78] text-white hover:bg-[#2c4b63] shadow-xs'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
              </button>
            </div>

            {/* Key Vocabulary Shelf */}
            <section className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E6A653]" />
                  <h3 className="font-serif-book text-lg font-semibold text-[#20313D]">
                    Key Vocabulary for this Story
                  </h3>
                </div>
                <span className="text-xs text-[#657681]">
                  {story.vocabulary.length} words
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {story.vocabulary.map((v) => {
                  const saved = isWordSaved(v.word);
                  return (
                    <div
                      key={v.word}
                      onClick={() => {
                        setSelectedWord(v);
                        setIsModalOpen(true);
                      }}
                      className="p-3.5 rounded-xl bg-[#F1F4F2]/60 hover:bg-[#E3ECF0]/80 border border-[#B5C3CA]/30 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif-book font-semibold text-sm text-[#20313D] group-hover:text-[#365C78]">
                            {v.word}
                          </span>
                          {v.partOfSpeech && (
                            <span className="text-[11px] text-[#657681] italic">
                              {v.partOfSpeech}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#657681] line-clamp-1 mt-0.5">
                          {v.meaning}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                              const u = new SpeechSynthesisUtterance(v.word);
                              u.lang = 'en-US';
                              u.rate = 0.85;
                              window.speechSynthesis.speak(u);
                            }
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#365C78] hover:bg-[#365C78] hover:text-white transition-colors"
                          title="Listen to word"
                          aria-label={`Pronounce ${v.word}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (saved) {
                              removeWordFromBank(v.word);
                            } else {
                              saveWordToBank(v, story.id, story.title);
                            }
                          }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            saved
                              ? 'text-[#356A58] bg-[#356A58]/10'
                              : 'text-[#657681] hover:text-[#E6A653]'
                          }`}
                          title={saved ? 'In Word Bank' : 'Save to Word Bank'}
                          aria-label={saved ? 'Remove from Word Bank' : 'Save to Word Bank'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Comprehension Quiz */}
            {story.questions && story.questions.length > 0 && (
              <ComprehensionQuiz
                questions={story.questions}
                savedScore={storyProgress.quizScore}
                onComplete={(score) => saveQuizResult(story.id, score)}
              />
            )}

            {/* Next Story Recommendation */}
            {nextStory && (
              <div
                onClick={() => onSelectStory(nextStory.id)}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#B5C3CA]/40 hover:border-[#365C78] transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div>
                  <span className="text-[11px] font-semibold text-[#657681] uppercase tracking-wider">
                    Next Story in Collection
                  </span>
                  <h4 className="font-serif-book text-base font-semibold text-[#20313D] group-hover:text-[#365C78] transition-colors mt-0.5">
                    {nextStory.title}
                  </h4>
                  <p className="text-xs text-[#657681] mt-0.5">
                    {nextStory.level} · {nextStory.minutes} min read
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E3ECF0] text-[#365C78] flex items-center justify-center group-hover:bg-[#365C78] group-hover:text-white transition-colors shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            )}

            {/* Story Reading Session Stats */}
            <div className="pt-6 border-t border-[#B5C3CA]/25 flex flex-wrap items-center justify-between gap-3 text-xs text-[#657681] font-sans">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-[#20313D] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#365C78]" />
                  <span className="text-[#657681]">Time on this story:</span>
                  <span className="font-mono tabular-nums text-[#365C78] font-semibold">
                    {formatTimeSpent(storyTimeSpent)}
                  </span>
                </div>
                <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
                <div className="flex items-center gap-1.5 text-[#356A58] font-medium">
                  <span className="text-[#657681]">Practiced today:</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {formatTimeSpent(todayReadingSeconds)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#657681]">
                <span>Target read time: ~{story.minutes} min</span>
                <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
                <span>{readingProgress}% read</span>
              </div>
            </div>
          </div>
        </article>

        {/* Small, Non-Intrusive Bottom Reader Bar */}
        <div className="mt-5 flex items-center justify-between px-3 text-xs text-[#657681] font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-[#365C78]" />
            <span>Story: <strong className="font-mono font-semibold text-[#20313D] tabular-nums">{formatTimeSpent(storyTimeSpent)}</strong></span>
            <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
            <span>Practiced today: <strong className="font-mono font-semibold text-[#356A58] tabular-nums">{formatTimeSpent(todayReadingSeconds)}</strong></span>
          </div>
          <span className="text-[11px] text-[#657681]">
            Estimated {story.minutes} min read
          </span>
        </div>
      </div>

      {/* Docked Sticky Bottom Audio Player Bar */}
      {isAnyAudioActive && (
        <aside
          aria-label="Paragraph audio narration controls"
          className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#B5C3CA]/40 shadow-lg px-4 py-3 animate-in slide-in-from-bottom duration-200"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
            {/* Status & Paragraph Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E6A653] animate-ping" />
                <span className="text-xs font-semibold text-[#20313D]">
                  Paragraph {(speech.activeParagraphIndex ?? 0) + 1} of {story.narrative.length}
                </span>
                <span className="text-[11px] text-[#657681] font-mono tabular-nums">
                  ({audioSpeed}×)
                </span>
                <span aria-hidden="true" className="text-[#B5C3CA] hidden md:inline">·</span>
                <span className="text-[11px] text-[#657681] hidden md:flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#365C78]" />
                  <span>Story: <strong className="font-mono font-medium text-[#20313D] tabular-nums">{formatTimeSpent(storyTimeSpent)}</strong></span>
                  <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
                  <span>Today: <strong className="font-mono font-medium text-[#356A58] tabular-nums">{formatTimeSpent(todayReadingSeconds)}</strong></span>
                </span>
              </div>

              {/* Mobile Stop button */}
              <button
                type="button"
                onClick={speech.stop}
                className="sm:hidden p-2 text-[#657681] hover:text-[#20313D]"
                aria-label="Stop narration"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              {/* Prev paragraph button */}
              <button
                type="button"
                disabled={speech.activeParagraphIndex === 0}
                onClick={() => skipParagraph(-1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#657681] hover:text-[#20313D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                title="Previous paragraph"
                aria-label="Previous paragraph"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Replay paragraph */}
              <button
                type="button"
                onClick={replayCurrentParagraph}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Replay this paragraph"
                aria-label="Replay this paragraph"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Main Play / Pause/Stop Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (speech.activeParagraphIndex !== null) {
                    handleParagraphSpeakerClick(
                      speech.activeParagraphIndex,
                      story.narrative[speech.activeParagraphIndex]
                    );
                  }
                }}
                className={`min-h-[44px] px-4 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                  speech.playbackState === 'playing'
                    ? 'bg-[#E6A653] hover:bg-[#d4943f]'
                    : 'bg-[#365C78] hover:bg-[#2b4c64]'
                }`}
                aria-label={speech.playbackState === 'playing' ? 'Pause narration' : 'Play narration'}
              >
                {speech.playbackState === 'playing' ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              {/* Next paragraph button */}
              <button
                type="button"
                disabled={speech.activeParagraphIndex === story.narrative.length - 1}
                onClick={() => skipParagraph(1)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#657681] hover:text-[#20313D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                title="Next paragraph"
                aria-label="Next paragraph"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Continuous Mode Toggle & Speed & Stop */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setContinuousMode(!continuousMode)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  continuousMode
                    ? 'bg-[#E3ECF0] text-[#365C78] font-semibold'
                    : 'text-[#657681] hover:bg-slate-100'
                }`}
                title={continuousMode ? 'Continuous playback active' : 'Single paragraph mode'}
                aria-label="Toggle continuous mode"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {continuousMode ? 'Continuous' : 'Single ¶'}
                </span>
              </button>

              {/* Speed cycle button */}
              <button
                type="button"
                onClick={() => {
                  const speeds = [0.8, 1.0, 1.2];
                  const nextSpeed = speeds[(speeds.indexOf(audioSpeed) + 1) % speeds.length];
                  setAudioSpeed(nextSpeed);
                  if (speech.activeParagraphIndex !== null && speech.playbackState === 'playing') {
                    speech.play(
                      speech.activeParagraphIndex,
                      story.narrative[speech.activeParagraphIndex]
                    );
                  }
                }}
                className="px-2 py-1 rounded-lg text-xs font-mono text-[#365C78] bg-[#E3ECF0] hover:bg-[#365C78] hover:text-white transition-colors cursor-pointer"
                title="Cycle narration speed"
                aria-label="Narration speed"
              >
                {audioSpeed}×
              </button>

              <button
                type="button"
                onClick={speech.stop}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#657681] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                aria-label="Stop narration"
              >
                <X className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Word Definition Modal */}
      <WordLookupModal
        item={selectedWord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSaved={selectedWord ? isWordSaved(selectedWord.word) : false}
        onToggleSave={() => {
          if (!selectedWord) return;
          if (isWordSaved(selectedWord.word)) {
            removeWordFromBank(selectedWord.word);
          } else {
            saveWordToBank(selectedWord, story.id, story.title);
          }
        }}
        storyTitle={story.title}
      />

      {/* Settings Drawer */}
      <ReadingSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
