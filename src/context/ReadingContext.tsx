import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Story,
  SavedWord,
  StoryProgress,
  ReadingTheme,
  FontSize,
  FontStyle,
  ActiveTab,
  VocabularyItem
} from '../types';
import { INITIAL_STORIES } from '../data/stories';

interface ReadingContextType {
  stories: Story[];
  activeStory: Story | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectStory: (id: string | null) => void;
  
  // Progress & Bookmarks
  progressMap: Record<string, StoryProgress>;
  toggleBookmark: (storyId: string) => void;
  updateParagraphProgress: (storyId: string, paragraphIndex: number) => void;
  markStoryCompleted: (storyId: string, completed?: boolean) => void;
  saveQuizResult: (storyId: string, score: number) => void;
  
  // Vocabulary Bank
  savedWords: SavedWord[];
  saveWordToBank: (item: VocabularyItem, storyId?: string, storyTitle?: string) => void;
  removeWordFromBank: (word: string) => void;
  toggleWordMastered: (word: string) => void;
  isWordSaved: (word: string) => boolean;

  // Reading Experience Settings
  theme: ReadingTheme;
  setTheme: (theme: ReadingTheme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontStyle: FontStyle;
  setFontStyle: (style: FontStyle) => void;
  highlightVocab: boolean;
  setHighlightVocab: (highlight: boolean) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;

  // Daily Reading Goal
  dailyGoalMinutes: number;
  setDailyGoalMinutes: (minutes: number) => void;
  todayReadingSeconds: number;
  todayReadingMinutes: number;
  recordReadingSeconds: (seconds: number, storyId?: string) => void;
  getStoryTimeSpent: (storyId: string) => number;
  streakDays: number;

  // Custom stories
  addStory: (story: Story) => void;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

const STORAGE_KEYS = {
  STORIES: 'pocket_storybook_stories_v1',
  PROGRESS: 'pocket_storybook_progress_v1',
  WORDS: 'pocket_storybook_saved_words_v1',
  THEME: 'pocket_storybook_theme_v1',
  FONT_SIZE: 'pocket_storybook_fontsize_v1',
  FONT_STYLE: 'pocket_storybook_fontstyle_v1',
  HIGHLIGHT_VOCAB: 'pocket_storybook_highlight_v1',
  AUDIO_SPEED: 'pocket_storybook_audiospeed_v1',
  DAILY_GOAL: 'pocket_storybook_daily_goal_v1',
  READING_LOG: 'pocket_storybook_reading_log_v1'
};

export const ReadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load custom stories + initial stories
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge initial stories with any custom user stories
        const customStories = parsed.filter((s: Story) => s.isCustom);
        return [...INITIAL_STORIES, ...customStories];
      }
    } catch (e) {
      console.warn('Error reading stories from localStorage:', e);
    }
    return INITIAL_STORIES;
  });

  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');

  // Reading progress and bookmarks
  const [progressMap, setProgressMap] = useState<Record<string, StoryProgress>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading progress:', e);
    }
    // Default initial bookmarks
    return {
      '2c437665-f014-4ac3-bfe6-64b601912001': {
        storyId: '2c437665-f014-4ac3-bfe6-64b601912001',
        paragraphIndex: 1,
        completed: false,
        bookmarked: true,
        lastReadAt: new Date().toISOString()
      }
    };
  });

  // Saved vocabulary bank
  const [savedWords, setSavedWords] = useState<SavedWord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WORDS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading words:', e);
    }
    // Initial starter vocabulary from first story
    return [
      {
        id: 'w1',
        word: 'quiet',
        phonetic: '/ˈkwaɪ.ət/',
        partOfSpeech: 'adjective',
        meaning: 'Making very little noise; calm and peaceful',
        example: 'The street is quiet in the morning.',
        storyId: '2c437665-f014-4ac3-bfe6-64b601912001',
        storyTitle: 'The Little Blue Door',
        dateAdded: new Date().toISOString(),
        mastered: true
      },
      {
        id: 'w2',
        word: 'beside',
        phonetic: '/bɪˈsaɪd/',
        partOfSpeech: 'preposition',
        meaning: 'At the side of; next to something',
        example: 'The flower is beside the door.',
        storyId: '2c437665-f014-4ac3-bfe6-64b601912001',
        storyTitle: 'The Little Blue Door',
        dateAdded: new Date().toISOString(),
        mastered: false
      },
      {
        id: 'w3',
        word: 'umbrella',
        phonetic: '/ʌmˈbrel.ə/',
        partOfSpeech: 'noun',
        meaning: 'A circular canopy that you hold over your head to stay dry in rain',
        example: 'Leo carries a red umbrella.',
        storyId: '2c437665-f014-4ac3-bfe6-64b601912002',
        storyTitle: 'A Rainy Day at the Market',
        dateAdded: new Date().toISOString(),
        mastered: false
      }
    ];
  });

  // Display and Reading Settings
  const [theme, setTheme] = useState<ReadingTheme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as ReadingTheme) || 'paper';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as FontSize) || 'base';
  });

  const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
    return (localStorage.getItem(STORAGE_KEYS.FONT_STYLE) as FontStyle) || 'serif';
  });

  const [highlightVocab, setHighlightVocab] = useState<boolean>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.HIGHLIGHT_VOCAB);
    return val === null ? true : val === 'true';
  });

  const [audioSpeed, setAudioSpeed] = useState<number>(() => {
    const val = localStorage.getItem(STORAGE_KEYS.AUDIO_SPEED);
    return val ? parseFloat(val) : 1.0;
  });

  // Daily Reading Goal (target minutes, e.g. 15)
  const [dailyGoalMinutes, setDailyGoalMinutesState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      if (stored) return parseInt(stored, 10);
    } catch {}
    return 15;
  });

  const setDailyGoalMinutes = (minutes: number) => {
    const val = Math.max(1, Math.min(180, minutes));
    setDailyGoalMinutesState(val);
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, String(val));
    } catch {}
  };

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  // Daily Reading Log (date string YYYY-MM-DD -> total seconds read)
  const [dailyReadingLog, setDailyReadingLog] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.READING_LOG);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Seed meaningful starter reading metrics: today has 8 min (480s), yesterday has 15 min (900s)
    const today = new Date().toISOString().split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().split('T')[0];
    return {
      [yesterday]: 900,
      [today]: 480
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.READING_LOG, JSON.stringify(dailyReadingLog));
    } catch (e) {}
  }, [dailyReadingLog]);

  const todayKey = getTodayKey();
  const todayReadingSeconds = dailyReadingLog[todayKey] || 0;
  const todayReadingMinutes = Math.floor(todayReadingSeconds / 60);

  const recordReadingSeconds = (seconds: number, storyId?: string) => {
    if (seconds <= 0) return;
    setDailyReadingLog((prev) => {
      const key = getTodayKey();
      const current = prev[key] || 0;
      return {
        ...prev,
        [key]: current + seconds
      };
    });

    if (storyId) {
      setProgressMap((prev) => {
        const current = prev[storyId] || {
          storyId,
          paragraphIndex: 0,
          completed: false,
          bookmarked: false,
          lastReadAt: new Date().toISOString()
        };
        return {
          ...prev,
          [storyId]: {
            ...current,
            timeSpentSeconds: (current.timeSpentSeconds || 0) + seconds,
            lastReadAt: new Date().toISOString()
          }
        };
      });
    }
  };

  const getStoryTimeSpent = (storyId: string) => {
    return progressMap[storyId]?.timeSpentSeconds || 0;
  };

  // Calculate reading streak in days
  const streakDays = React.useMemo(() => {
    let count = 0;
    const checkDate = new Date();
    
    // Check today first
    const todayStr = checkDate.toISOString().split('T')[0];
    const todaySecs = dailyReadingLog[todayStr] || 0;
    if (todaySecs > 0) {
      count++;
    }

    // Check consecutive prior days
    for (let i = 1; i <= 365; i++) {
      const prevD = new Date();
      prevD.setDate(prevD.getDate() - i);
      const prevStr = prevD.toISOString().split('T')[0];
      if ((dailyReadingLog[prevStr] || 0) > 0) {
        count++;
      } else {
        break;
      }
    }
    return Math.max(1, count);
  }, [dailyReadingLog]);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to save progress', e);
    }
  }, [progressMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(savedWords));
    } catch (e) {
      console.warn('Failed to save words', e);
    }
  }, [savedWords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
    } catch (e) {}
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_STYLE, fontStyle);
    } catch (e) {}
  }, [fontStyle]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHT_VOCAB, String(highlightVocab));
    } catch (e) {}
  }, [highlightVocab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIO_SPEED, String(audioSpeed));
    } catch (e) {}
  }, [audioSpeed]);

  const activeStory = stories.find((s) => s.id === activeStoryId) || null;

  const selectStory = (id: string | null) => {
    setActiveStoryId(id);
    if (id) {
      setActiveTab('reader');
      // Update last read time
      setProgressMap((prev) => {
        const current = prev[id] || {
          storyId: id,
          paragraphIndex: 0,
          completed: false,
          bookmarked: false,
          lastReadAt: new Date().toISOString()
        };
        return {
          ...prev,
          [id]: {
            ...current,
            lastReadAt: new Date().toISOString()
          }
        };
      });
    }
  };

  const toggleBookmark = (storyId: string) => {
    setProgressMap((prev) => {
      const current = prev[storyId] || {
        storyId,
        paragraphIndex: 0,
        completed: false,
        bookmarked: false,
        lastReadAt: new Date().toISOString()
      };
      return {
        ...prev,
        [storyId]: {
          ...current,
          bookmarked: !current.bookmarked,
          lastReadAt: new Date().toISOString()
        }
      };
    });
  };

  const updateParagraphProgress = (storyId: string, paragraphIndex: number) => {
    setProgressMap((prev) => {
      const current = prev[storyId] || {
        storyId,
        paragraphIndex: 0,
        completed: false,
        bookmarked: false,
        lastReadAt: new Date().toISOString()
      };
      return {
        ...prev,
        [storyId]: {
          ...current,
          paragraphIndex,
          lastReadAt: new Date().toISOString()
        }
      };
    });
  };

  const markStoryCompleted = (storyId: string, completed = true) => {
    setProgressMap((prev) => {
      const current = prev[storyId] || {
        storyId,
        paragraphIndex: 0,
        completed: false,
        bookmarked: false,
        lastReadAt: new Date().toISOString()
      };
      return {
        ...prev,
        [storyId]: {
          ...current,
          completed,
          lastReadAt: new Date().toISOString()
        }
      };
    });
  };

  const saveQuizResult = (storyId: string, score: number) => {
    setProgressMap((prev) => {
      const current = prev[storyId] || {
        storyId,
        paragraphIndex: 0,
        completed: true,
        bookmarked: false,
        lastReadAt: new Date().toISOString()
      };
      return {
        ...prev,
        [storyId]: {
          ...current,
          completed: true,
          quizScore: score,
          quizCompleted: true,
          lastReadAt: new Date().toISOString()
        }
      };
    });
  };

  const saveWordToBank = (item: VocabularyItem, storyId?: string, storyTitle?: string) => {
    const cleanWord = item.word.toLowerCase().trim();
    if (savedWords.some((w) => w.word.toLowerCase() === cleanWord)) {
      return;
    }
    const newWord: SavedWord = {
      ...item,
      id: 'word_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      storyId,
      storyTitle,
      dateAdded: new Date().toISOString(),
      mastered: false
    };
    setSavedWords((prev) => [newWord, ...prev]);
  };

  const removeWordFromBank = (wordStr: string) => {
    const clean = wordStr.toLowerCase().trim();
    setSavedWords((prev) => prev.filter((w) => w.word.toLowerCase() !== clean));
  };

  const toggleWordMastered = (wordStr: string) => {
    const clean = wordStr.toLowerCase().trim();
    setSavedWords((prev) =>
      prev.map((w) =>
        w.word.toLowerCase() === clean ? { ...w, mastered: !w.mastered } : w
      )
    );
  };

  const isWordSaved = (wordStr: string): boolean => {
    const clean = wordStr.toLowerCase().trim();
    return savedWords.some((w) => w.word.toLowerCase() === clean);
  };

  const addStory = (story: Story) => {
    const updated = [story, ...stories];
    setStories(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save stories:', e);
    }
    selectStory(story.id);
  };

  return (
    <ReadingContext.Provider
      value={{
        stories,
        activeStory,
        activeTab,
        setActiveTab,
        selectStory,
        progressMap,
        toggleBookmark,
        updateParagraphProgress,
        markStoryCompleted,
        saveQuizResult,
        savedWords,
        saveWordToBank,
        removeWordFromBank,
        toggleWordMastered,
        isWordSaved,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        fontStyle,
        setFontStyle,
        highlightVocab,
        setHighlightVocab,
        audioSpeed,
        setAudioSpeed,
        dailyGoalMinutes,
        setDailyGoalMinutes,
        todayReadingSeconds,
        todayReadingMinutes,
        recordReadingSeconds,
        getStoryTimeSpent,
        streakDays,
        addStory
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
};
