import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Bookmark,
  Layers,
  Sparkles,
  TrendingUp,
  Compass,
  ArrowRight
} from 'lucide-react';
import { ReadingProvider, useReading } from './context/ReadingContext';
import { ReadingLevel } from './types';
import { Header } from './components/Header';
import { StoryCard } from './components/StoryCard';
import { StoryReader } from './components/StoryReader';
import { VocabularyBank } from './components/VocabularyBank';
import { BookshelfView } from './components/BookshelfView';
import { StoryWeaverModal } from './components/StoryWeaverModal';
import { DailyReadingGoalCard } from './components/DailyReadingGoalCard';
import heroImage from './assets/images/hero_pocket_storybook_1790847713354.jpg';

function MainApp() {
  const {
    stories,
    activeStory,
    activeTab,
    setActiveTab,
    selectStory,
    progressMap,
    toggleBookmark,
    savedWords
  } = useReading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ReadingLevel | 'all' | 'bookmarked'>('all');
  const [isWeaverOpen, setIsWeaverOpen] = useState(false);

  // Filter stories
  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.scene.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.vocabulary.some((v) => v.word.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedLevel === 'bookmarked') {
      return progressMap[story.id]?.bookmarked;
    }
    if (selectedLevel !== 'all') {
      return story.level === selectedLevel;
    }
    return true;
  });

  // Calculate reader summary numbers
  const bookmarkedCount = stories.filter((s) => progressMap[s.id]?.bookmarked).length;
  const completedCount = stories.filter((s) => progressMap[s.id]?.completed).length;

  return (
    <div className="min-h-screen bg-[#F1F4F2] text-[#20313D] flex flex-col font-sans">
      {/* Top Bar with Top Bar Contract */}
      <Header onOpenWeaver={() => setIsWeaverOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'reader' && activeStory ? (
          <StoryReader
            story={activeStory}
            onBack={() => setActiveTab('library')}
            onSelectStory={(id) => selectStory(id)}
          />
        ) : activeTab === 'vocabulary' ? (
          <VocabularyBank />
        ) : activeTab === 'bookshelf' ? (
          <BookshelfView />
        ) : (
          /* Library View */
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Hero Banner: A Pocket Storybook */}
            <div className="relative rounded-3xl bg-white border border-[#B5C3CA]/40 overflow-hidden shadow-xs mb-8">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center">
                <div className="p-6 sm:p-10 md:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Unboxed editorial kicker */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#365C78] uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#E6A653]" />
                      <span>Graded English Readers · CEFR A1–B2</span>
                    </div>

                    <h1 className="font-serif-book text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#20313D] leading-tight mb-3">
                      A pocket storybook with spacious reading pages.
                    </h1>

                    <p className="text-sm text-[#657681] leading-relaxed max-w-xl mb-6">
                      Explore serene short stories with slate-blue level markers, slim amber bookmarks, instant word definitions, and audio narration designed for language learners.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const first = stories[0];
                        if (first) selectStory(first.id);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#365C78] hover:bg-[#2c4b63] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-[#E6A653]" />
                      <span>Begin Reading</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsWeaverOpen(true)}
                      className="px-4 py-2.5 rounded-xl border border-[#B5C3CA] hover:border-[#365C78] text-[#20313D] text-xs font-medium bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E6A653]" />
                      <span>Weave Custom Story</span>
                    </button>
                  </div>
                </div>

                {/* Hero Illustration */}
                <div className="md:col-span-5 h-48 md:h-full relative min-h-[220px] bg-[#E3ECF0] overflow-hidden">
                  <img
                    src={heroImage}
                    alt="Pocket storybook illustration with amber bookmark"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent" />
                </div>
              </div>

              {/* Reader Metric Badges Bar */}
              <div className="bg-[#F1F4F2]/80 border-t border-[#B5C3CA]/30 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-[#657681] gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-[#20313D]">
                    <span className="w-2 h-2 rounded-full bg-[#365C78]" />
                    {stories.length} Graded Stories
                  </span>
                  <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
                  <span>{bookmarkedCount} Bookmarked</span>
                  <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
                  <span>{savedWords.length} Words in Bank</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#356A58] font-medium">
                  <span>{completedCount} of {stories.length} Stories Read</span>
                </div>
              </div>
            </div>

            {/* Daily Reading Goal Card with Progress Circle */}
            <DailyReadingGoalCard />

            {/* Filter Tabs and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-8">
              {/* Interactive Segmented Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#B5C3CA]/40 shadow-2xs overflow-x-auto">
                {[
                  { id: 'all', label: 'All Stories' },
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'elementary', label: 'Elementary' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'bookmarked', label: `Bookmarked (${bookmarkedCount})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedLevel(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedLevel === tab.id
                        ? 'bg-[#E3ECF0] text-[#365C78] font-semibold shadow-2xs'
                        : 'text-[#657681] hover:text-[#20313D]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#657681] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, scenes, words..."
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#B5C3CA]/40 text-xs text-[#20313D] placeholder-[#657681] focus:outline-none focus:ring-1 focus:ring-[#365C78]"
                />
              </div>
            </div>

            {/* Stories Grid */}
            {filteredStories.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#B5C3CA]/40 p-12 text-center shadow-xs">
                <Compass className="w-10 h-10 text-[#B5C3CA] mx-auto mb-3" />
                <h3 className="font-serif-book text-lg font-semibold text-[#20313D] mb-1">
                  No stories found
                </h3>
                <p className="text-xs text-[#657681] max-w-sm mx-auto mb-4">
                  No stories match your filter criteria. Try adjusting the level or search keyword.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLevel('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#365C78] text-white text-xs font-semibold rounded-xl hover:bg-[#2c4b63] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
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
          </div>
        )}
      </main>

      {/* Story Weaver Modal */}
      <StoryWeaverModal
        isOpen={isWeaverOpen}
        onClose={() => setIsWeaverOpen(false)}
      />

      {/* Footer with clean copyright & quiet links */}
      <footer className="mt-auto border-t border-[#B5C3CA]/30 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#657681]">
          <div className="flex items-center gap-2">
            <span className="font-serif-book font-semibold text-[#20313D]">Pocket Storybook</span>
            <span>·</span>
            <span>Spacious Reading Pages, Slate-Blue Level Markers, Slim Amber Bookmarks</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('vocabulary')}
              className="hover:text-[#20313D] transition-colors cursor-pointer"
            >
              Word Bank
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bookshelf')}
              className="hover:text-[#20313D] transition-colors cursor-pointer"
            >
              Bookshelf
            </button>
            <button
              type="button"
              onClick={() => setIsWeaverOpen(true)}
              className="hover:text-[#20313D] transition-colors cursor-pointer"
            >
              Weave Story
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ReadingProvider>
      <MainApp />
    </ReadingProvider>
  );
}
