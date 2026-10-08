export type ReadingLevel = 'beginner' | 'elementary' | 'intermediate';

export interface VocabularyItem {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  meaning: string;
  example: string;
}

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Story {
  id: string;
  title: string;
  level: ReadingLevel;
  minutes: number;
  icon: string;
  scene: string;
  coverImage: string;
  summary?: string;
  keyThemes?: string[];
  learningFocus?: string;
  narrative: string[];
  vocabulary: VocabularyItem[];
  questions?: ComprehensionQuestion[];
  isCustom?: boolean;
}

export interface SavedWord extends VocabularyItem {
  id: string;
  storyId?: string;
  storyTitle?: string;
  dateAdded: string;
  mastered: boolean;
  notes?: string;
}

export interface StoryProgress {
  storyId: string;
  paragraphIndex: number;
  completed: boolean;
  bookmarked: boolean;
  timeSpentSeconds?: number;
  quizScore?: number;
  quizCompleted?: boolean;
  lastReadAt: string;
}

export type ReadingTheme = 'paper' | 'sepia' | 'night' | 'white';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type FontStyle = 'serif' | 'sans';
export type ActiveTab = 'library' | 'reader' | 'vocabulary' | 'bookshelf';
