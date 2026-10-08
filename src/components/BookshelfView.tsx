import React from 'react';
import {
  Bookmark,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useReading } from '../context/ReadingContext';
import { StoryCard } from './StoryCard';
import { DailyReadingGoalCard } from './DailyReadingGoalCard';
import { ReadingMilestones } from './ReadingMilestones';

export const BookshelfView: React.FC = () => {
  const {
    stories,
    progressMap,
    savedWords,
    selectStory,
    toggleBookmark,
    setActiveTab
  } = useReading();

  // Compute metrics
  const bookmarkedStories = stories.filter(
    (s) => progressMap[s.id]?.bookmarked
  );

  const completedStories = stories.filter(
    (s) => progressMap[s.id]?.completed
  );

  const masteredWordsCount = savedWords.filter((w) => w.mastered).length;

  const totalReadingMinutes = completedStories.reduce(
    (sum, s) => sum + s.minutes,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Deck */}
      <div className="mb-8 pb-6 border-b border-[#B5C3CA]/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#365C78] uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5 text-[#E6A653]" />
          <span>Reader’s Study</span>
        </div>
        <h1 className="font-serif-book text-3xl font-semibold tracking-tight text-[#20313D]">
          My Bookshelf & Reading Progress
        </h1>
        <p className="text-xs text-[#657681] mt-1">
          Track completed stories, active bookmarks, and mastered vocabulary milestones.
        </p>
      </div>

      {/* Reader Quantitative Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#657681] mb-2">
            <span>Stories Completed</span>
            <CheckCircle className="w-4 h-4 text-[#356A58]" />
          </div>
          <div className="font-serif-book text-3xl font-bold text-[#20313D] tabular-nums">
            {completedStories.length}
            <span className="text-sm font-sans font-normal text-[#657681] ml-1">
              / {stories.length}
            </span>
          </div>
          <div className="text-[11px] text-[#657681] mt-1">
            {Math.round((completedStories.length / (stories.length || 1)) * 100)}% of library finished
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#657681] mb-2">
            <span>Active Bookmarks</span>
            <Bookmark className="w-4 h-4 fill-[#E6A653] text-[#E6A653]" />
          </div>
          <div className="font-serif-book text-3xl font-bold text-[#20313D] tabular-nums">
            {bookmarkedStories.length}
          </div>
          <div className="text-[11px] text-[#657681] mt-1">
            Pinned with amber ribbons
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#657681] mb-2">
            <span>Words Mastered</span>
            <Award className="w-4 h-4 text-[#365C78]" />
          </div>
          <div className="font-serif-book text-3xl font-bold text-[#20313D] tabular-nums">
            {masteredWordsCount}
            <span className="text-sm font-sans font-normal text-[#657681] ml-1">
              / {savedWords.length}
            </span>
          </div>
          <div className="text-[11px] text-[#657681] mt-1">
            In personal word bank
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#657681] mb-2">
            <span>Reading Time</span>
            <Clock className="w-4 h-4 text-[#E6A653]" />
          </div>
          <div className="font-serif-book text-3xl font-bold text-[#20313D] tabular-nums">
            {totalReadingMinutes}
            <span className="text-sm font-sans font-normal text-[#657681] ml-1">
              min
            </span>
          </div>
          <div className="text-[11px] text-[#657681] mt-1">
            Story reading exposure
          </div>
        </div>
      </div>

      {/* Daily Reading Goal Progress Card */}
      <DailyReadingGoalCard />

      {/* Reading Milestones & Honors Section */}
      <ReadingMilestones />

      {/* Bookmarked / Reading in Progress Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6A653]" />
            <h2 className="font-serif-book text-xl font-semibold text-[#20313D]">
              Bookmarked Stories
            </h2>
          </div>
          <span className="text-xs text-[#657681]">
            {bookmarkedStories.length} {bookmarkedStories.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {bookmarkedStories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-8 text-center shadow-2xs">
            <Bookmark className="w-8 h-8 text-[#B5C3CA] mx-auto mb-2" />
            <h3 className="font-serif-book text-base font-semibold text-[#20313D] mb-1">
              No Bookmarked Stories Yet
            </h3>
            <p className="text-xs text-[#657681] max-w-sm mx-auto mb-4">
              Tap the amber bookmark ribbon in any story or card to save your spot and return anytime.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className="px-4 py-2 bg-[#365C78] text-white text-xs font-semibold rounded-xl hover:bg-[#2c4b63] transition-colors cursor-pointer"
            >
              Browse Library
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                progress={progressMap[story.id]}
                onSelect={selectStory}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {/* Completed Stories Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#356A58]" />
            <h2 className="font-serif-book text-xl font-semibold text-[#20313D]">
              Completed Stories
            </h2>
          </div>
          <span className="text-xs text-[#657681]">
            {completedStories.length} finished
          </span>
        </div>

        {completedStories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-8 text-center shadow-2xs">
            <CheckCircle className="w-8 h-8 text-[#B5C3CA] mx-auto mb-2" />
            <h3 className="font-serif-book text-base font-semibold text-[#20313D] mb-1">
              No Completed Stories Yet
            </h3>
            <p className="text-xs text-[#657681] max-w-sm mx-auto mb-4">
              Read through a story to the end and take the comprehension quiz to celebrate your accomplishment.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className="px-4 py-2 bg-[#365C78] text-white text-xs font-semibold rounded-xl hover:bg-[#2c4b63] transition-colors cursor-pointer"
            >
              Start Reading
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                progress={progressMap[story.id]}
                onSelect={selectStory}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
