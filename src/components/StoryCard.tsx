import React from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Story, StoryProgress } from '../types';

interface StoryCardProps {
  story: Story;
  progress?: StoryProgress;
  onSelect: (storyId: string) => void;
  onToggleBookmark: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  progress,
  onSelect,
  onToggleBookmark
}) => {
  const isBookmarked = progress?.bookmarked || false;
  const isCompleted = progress?.completed || false;
  const paragraphIndex = progress?.paragraphIndex || 0;
  const totalParagraphs = story.narrative.length;
  const progressPercent = totalParagraphs > 0 ? Math.round((paragraphIndex / totalParagraphs) * 100) : 0;

  const levelColorMap: Record<Story['level'], string> = {
    beginner: 'text-[#365C78]',
    elementary: 'text-[#356A58]',
    intermediate: 'text-[#96552B]'
  };

  const levelLabelMap: Record<Story['level'], string> = {
    beginner: 'Beginner Level',
    elementary: 'Elementary Level',
    intermediate: 'Intermediate Level'
  };

  return (
    <div
      onClick={() => onSelect(story.id)}
      className="group relative bg-[#FFFFFF] rounded-2xl border border-[#B5C3CA]/40 overflow-hidden shadow-xs hover:shadow-md hover:border-[#365C78]/40 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Slim Amber Bookmark Ribbon */}
      <button
        type="button"
        title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
        aria-label={isBookmarked ? 'Bookmarked story' : 'Bookmark story'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleBookmark(story.id);
        }}
        className={`cursor-pointer transition-all duration-200 ${
          isBookmarked
            ? 'amber-bookmark-ribbon hover:brightness-110'
            : 'amber-bookmark-ribbon-inactive hover:bg-[#E6A653]/60'
        }`}
      />

      {/* Cover Illustration */}
      <div className="relative aspect-4/3 w-full bg-[#E3ECF0] overflow-hidden">
        <img
          src={story.coverImage}
          alt={story.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            // Zero broken images fallback
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
        {/* Soft gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Completed marker on image */}
        {isCompleted && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[#356A58] text-[11px] font-medium shadow-xs">
            <CheckCircle className="w-3.5 h-3.5 fill-[#356A58] text-white" />
            <span>Finished</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Zero-pill unboxed text discipline */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#657681] mb-2">
            <span className={`font-semibold ${levelColorMap[story.level]}`}>
              {levelLabelMap[story.level]}
            </span>
            <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#657681]" />
              <span className="tabular-nums">{story.minutes}</span> min read
            </span>
            <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
            <span>{story.vocabulary.length} words</span>
          </div>

          {/* Title */}
          <h3 className="font-serif-book text-xl font-semibold text-[#20313D] group-hover:text-[#365C78] transition-colors line-clamp-1 mb-1.5">
            {story.title}
          </h3>

          {/* Scene / Theme Kicker */}
          <p className="text-xs text-[#657681] italic mb-3">
            {story.scene}
          </p>

          {/* Narrative excerpt */}
          <p className="text-xs text-[#20313D]/80 line-clamp-2 leading-relaxed">
            {story.narrative[0]}
          </p>
        </div>

        {/* Footer info & progress bar */}
        <div className="mt-4 pt-3 border-t border-[#B5C3CA]/20">
          {progress && progressPercent > 0 && !isCompleted ? (
            <div>
              <div className="flex justify-between items-center text-[11px] text-[#657681] mb-1">
                <span>Reading progress</span>
                <span className="font-mono tabular-nums">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#E3ECF0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#365C78] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-[#365C78] font-medium group-hover:translate-x-0.5 transition-transform">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Read Story
              </span>
              <span className="text-[#B5C3CA] group-hover:text-[#365C78]">→</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
