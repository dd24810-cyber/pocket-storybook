import React from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { ActiveTab } from '../types';
import { useReading } from '../context/ReadingContext';
import { speechService } from '../services/speech';

interface HeaderProps {
  onOpenWeaver: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWeaver }) => {
  const { activeTab, setActiveTab, activeStory } = useReading();
  const [muted, setMuted] = React.useState(false);

  const toggleSound = () => {
    if (muted) {
      setMuted(false);
    } else {
      speechService.stop();
      setMuted(true);
    }
  };

  const navItems: { key: ActiveTab; label: string }[] = [
    { key: 'library', label: 'Library' },
    { key: 'reader', label: activeStory ? 'Reader' : 'Story' },
    { key: 'vocabulary', label: 'Vocabulary' },
    { key: 'bookshelf', label: 'Bookshelf' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#B5C3CA]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className="font-serif-book text-lg sm:text-xl font-semibold tracking-tight text-[#365C78] hover:text-[#20313D] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#E6A653] inline-block" />
          Pocket Storybook
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#365C78] font-semibold bg-[#E3ECF0]'
                    : 'text-[#657681] hover:text-[#20313D] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSound}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
            title={muted ? 'Audio muted' : 'Audio enabled'}
            aria-label={muted ? 'Unmute narration' : 'Mute narration'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenWeaver}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#365C78] hover:bg-[#2c4b63] rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6A653]" />
            <span className="hidden xs:inline">Create Story</span>
            <span className="xs:hidden">Create</span>
          </button>
        </div>
      </div>
    </header>
  );
};
