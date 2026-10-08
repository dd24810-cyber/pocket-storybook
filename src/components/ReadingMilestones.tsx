import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Flame,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Star,
  Clock,
  Compass,
  Check,
  ChevronRight,
  X,
  Target
} from 'lucide-react';
import { useReading } from '../context/ReadingContext';

export interface MilestoneItem {
  id: string;
  title: string;
  category: 'stories' | 'streak' | 'vocab' | 'time';
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  unlocked: boolean;
  color: 'amber' | 'spruce' | 'blue';
  iconType: 'book' | 'books10' | 'flame5' | 'flame3' | 'flame7' | 'vocab' | 'clock' | 'trophy';
  lore: string;
}

export const ReadingMilestones: React.FC = () => {
  const {
    stories,
    progressMap,
    savedWords,
    streakDays,
    todayReadingMinutes
  } = useReading();

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneItem | null>(null);

  // Completed stories count
  const completedStoriesCount = stories.filter(
    (s) => progressMap[s.id]?.completed
  ).length;

  const masteredWordsCount = savedWords.filter((w) => w.mastered).length;

  // Approximate total practicing minutes
  const totalReadingMinutes = stories
    .filter((s) => progressMap[s.id]?.completed)
    .reduce((sum, s) => sum + s.minutes, 0) + todayReadingMinutes;

  // List of Milestones including exact requested goals: '10 stories completed' & '5 days of reading streak'
  const milestones: MilestoneItem[] = [
    {
      id: 'milestone-first-story',
      title: 'First Page Turned',
      category: 'stories',
      description: 'Complete your first graded story from beginning to end.',
      currentValue: completedStoriesCount,
      targetValue: 1,
      unit: 'story',
      unlocked: completedStoriesCount >= 1,
      color: 'amber',
      iconType: 'book',
      lore: 'The longest journey begins with the very first page opened in peace.'
    },
    {
      id: 'milestone-3-stories',
      title: 'Curious Explorer',
      category: 'stories',
      description: 'Complete 3 stories across any CEFR graded reading level.',
      currentValue: completedStoriesCount,
      targetValue: 3,
      unit: 'stories',
      unlocked: completedStoriesCount >= 3,
      color: 'blue',
      iconType: 'book',
      lore: 'Expanding your horizons one narrative at a time builds real fluency.'
    },
    {
      id: 'milestone-10-stories',
      title: '10 Stories Completed',
      category: 'stories',
      description: 'Reach the esteemed landmark of finishing 10 stories in the library.',
      currentValue: completedStoriesCount,
      targetValue: 10,
      unit: 'stories',
      unlocked: completedStoriesCount >= 10,
      color: 'spruce',
      iconType: 'books10',
      lore: 'A true bookshelf milestone. Ten stories read demonstrates dedication and comprehension mastery.'
    },
    {
      id: 'milestone-3-day-streak',
      title: 'Spark of Habit',
      category: 'streak',
      description: 'Maintain a 3-day continuous reading practice streak.',
      currentValue: streakDays,
      targetValue: 3,
      unit: 'days',
      unlocked: streakDays >= 3,
      color: 'amber',
      iconType: 'flame3',
      lore: 'Consistency transforms casual practice into second nature.'
    },
    {
      id: 'milestone-5-day-streak',
      title: '5 Days of Reading Streak',
      category: 'streak',
      description: 'Keep your momentum burning strong with 5 consecutive days of reading.',
      currentValue: streakDays,
      targetValue: 5,
      unit: 'days',
      unlocked: streakDays >= 5,
      color: 'amber',
      iconType: 'flame5',
      lore: 'Five days of unbroken rhythm. Your reading streak is steady and radiant.'
    },
    {
      id: 'milestone-7-day-streak',
      title: 'Weekly Devotion',
      category: 'streak',
      description: 'Achieve a full 7-day unbroken reading streak.',
      currentValue: streakDays,
      targetValue: 7,
      unit: 'days',
      unlocked: streakDays >= 7,
      color: 'spruce',
      iconType: 'flame7',
      lore: 'A whole week of daily English reading! You have built a resilient lifelong habit.'
    },
    {
      id: 'milestone-5-vocab',
      title: 'Word Collector',
      category: 'vocab',
      description: 'Mark 5 vocabulary items as mastered in your personal bank.',
      currentValue: masteredWordsCount,
      targetValue: 5,
      unit: 'words',
      unlocked: masteredWordsCount >= 5,
      color: 'blue',
      iconType: 'vocab',
      lore: 'Every new word mastered is a permanent lens into deeper nuance.'
    },
    {
      id: 'milestone-30-minutes',
      title: 'Half-Hour Immersion',
      category: 'time',
      description: 'Log 30 cumulative minutes of dedicated reading and listening practice.',
      currentValue: totalReadingMinutes,
      targetValue: 30,
      unit: 'min',
      unlocked: totalReadingMinutes >= 30,
      color: 'spruce',
      iconType: 'clock',
      lore: 'Half an hour immersed in story language shapes natural listening and rhythm.'
    }
  ];

  const unlockedCount = milestones.filter((m) => m.unlocked).length;
  const totalCount = milestones.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'unlocked') return m.unlocked;
    if (filter === 'locked') return !m.unlocked;
    return true;
  });

  const renderBadgeIcon = (m: MilestoneItem) => {
    if (!m.unlocked) {
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#E3ECF0]/60 border border-[#B5C3CA]/40 flex items-center justify-center text-[#657681] shrink-0 relative">
          <Lock className="w-5 h-5 text-[#657681]" />
        </div>
      );
    }

    if (m.color === 'spruce') {
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#EAF3EE] border border-[#356A58]/30 flex items-center justify-center text-[#356A58] shrink-0 relative shadow-2xs">
          {m.iconType === 'books10' ? (
            <Trophy className="w-6 h-6" />
          ) : m.iconType === 'flame7' ? (
            <Flame className="w-6 h-6 fill-[#356A58]" />
          ) : (
            <Award className="w-6 h-6" />
          )}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#356A58] text-white flex items-center justify-center text-[9px]">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </div>
      );
    }

    if (m.color === 'blue') {
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#E3ECF0] border border-[#365C78]/30 flex items-center justify-center text-[#365C78] shrink-0 relative shadow-2xs">
          <Star className="w-6 h-6 fill-[#365C78]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#365C78] text-white flex items-center justify-center text-[9px]">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-2xl bg-[#FDF3E3] border border-[#E6A653]/40 flex items-center justify-center text-[#E6A653] shrink-0 relative shadow-2xs">
        {m.iconType === 'flame5' || m.iconType === 'flame3' ? (
          <Flame className="w-6 h-6 fill-[#E6A653]" />
        ) : (
          <Award className="w-6 h-6 fill-[#E6A653]/20" />
        )}
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E6A653] text-white flex items-center justify-center text-[9px]">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      </div>
    );
  };

  return (
    <section aria-label="Reading Milestones" className="mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#B5C3CA]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#365C78] uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-[#E6A653]" />
            <span>Honors & Milestones</span>
          </div>
          <h2 className="font-serif-book text-2xl font-semibold text-[#20313D] tracking-tight">
            Reading Milestones
          </h2>
          <p className="text-xs text-[#657681] mt-0.5">
            Badges earned as you conquer stories, nurture daily streaks, and expand vocabulary.
          </p>
        </div>

        {/* Milestone Summary Metric & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Progress Pill Bar */}
          <div className="bg-white rounded-xl border border-[#B5C3CA]/40 px-3.5 py-1.5 flex items-center gap-3 shadow-2xs">
            <div className="text-xs font-medium text-[#20313D]">
              <span className="font-bold text-[#365C78] font-mono tabular-nums">{unlockedCount}</span>
              <span className="text-[#657681]"> / {totalCount} Badges</span>
            </div>
            <div className="w-20 h-1.5 bg-[#E3ECF0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#365C78] to-[#E6A653] rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#657681] font-semibold">{completionPercentage}%</span>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex items-center bg-[#F1F4F2] p-1 rounded-xl border border-[#B5C3CA]/40 shadow-2xs">
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
              { id: 'locked', label: `In Progress (${totalCount - unlockedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-[#365C78] font-bold shadow-2xs'
                    : 'text-[#657681] hover:text-[#20313D]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMilestones.map((m) => {
          const percent = Math.min(100, Math.round((m.currentValue / m.targetValue) * 100));

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMilestone(m)}
              className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                m.unlocked
                  ? 'bg-white border-[#B5C3CA]/40 hover:border-[#365C78] hover:shadow-xs shadow-2xs'
                  : 'bg-white/70 border-[#B5C3CA]/30 hover:border-[#B5C3CA] opacity-85 hover:opacity-100'
              }`}
            >
              <div>
                {/* Top Badge Icon & Status Tag */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  {renderBadgeIcon(m)}

                  {m.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#356A58] bg-[#EAF3EE] px-2 py-0.5 rounded-full border border-[#356A58]/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#657681] bg-[#F1F4F2] px-2 py-0.5 rounded-full border border-[#B5C3CA]/30">
                      <span>{percent}%</span>
                    </span>
                  )}
                </div>

                {/* Badge Title & Description */}
                <h3 className="font-serif-book text-base font-semibold text-[#20313D] group-hover:text-[#365C78] transition-colors line-clamp-1">
                  {m.title}
                </h3>
                <p className="text-xs text-[#657681] mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Progress Footer */}
              <div className="mt-4 pt-3 border-t border-[#B5C3CA]/20">
                {m.unlocked ? (
                  <div className="flex items-center justify-between text-xs text-[#356A58] font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#356A58]" />
                      <span>Goal Reached</span>
                    </span>
                    <span className="font-mono text-[11px] text-[#657681]">
                      {m.targetValue} {m.unit}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#657681] mb-1.5 font-sans">
                      <span>Progress</span>
                      <span className="font-mono tabular-nums text-[#20313D] font-medium">
                        {m.currentValue} / {m.targetValue} {m.unit}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E3ECF0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#365C78] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Details Modal */}
      {selectedMilestone && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedMilestone.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl border border-[#B5C3CA]/40 shadow-xl overflow-hidden text-[#20313D] p-6 animate-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close milestone modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center pt-2">
              <div className="mb-4">
                {renderBadgeIcon(selectedMilestone)}
              </div>

              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#365C78] mb-1">
                <Award className="w-3.5 h-3.5 text-[#E6A653]" />
                <span>Reading Milestone</span>
              </div>

              <h3 className="font-serif-book text-2xl font-bold text-[#20313D]">
                {selectedMilestone.title}
              </h3>

              <p className="text-xs text-[#657681] max-w-xs mt-1 mb-4 leading-relaxed">
                {selectedMilestone.description}
              </p>

              <div className="w-full bg-[#F1F4F2] rounded-2xl p-4 border border-[#B5C3CA]/30 mb-5 text-left font-sans">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#657681] font-medium">Completion Progress:</span>
                  <span className="font-mono font-bold text-[#20313D]">
                    {selectedMilestone.currentValue} of {selectedMilestone.targetValue} {selectedMilestone.unit}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#E3ECF0] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedMilestone.unlocked ? 'bg-[#356A58]' : 'bg-[#365C78]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (selectedMilestone.currentValue / selectedMilestone.targetValue) * 100
                        )
                      )}%`
                    }}
                  />
                </div>

                <p className="text-[11px] text-[#657681] italic">
                  "{selectedMilestone.lore}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="w-full py-2.5 rounded-xl bg-[#365C78] hover:bg-[#2c4b63] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
