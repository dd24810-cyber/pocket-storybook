import React from 'react';
import { X, Check, Type, Sparkles } from 'lucide-react';
import { ReadingTheme, FontSize, FontStyle } from '../types';
import { useReading } from '../context/ReadingContext';

interface ReadingSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadingSettingsDrawer: React.FC<ReadingSettingsDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    fontStyle,
    setFontStyle,
    highlightVocab,
    setHighlightVocab,
    audioSpeed,
    setAudioSpeed
  } = useReading();

  if (!isOpen) return null;

  const themes: { id: ReadingTheme; name: string; bg: string; text: string; border: string }[] = [
    { id: 'paper', name: 'Paper', bg: 'bg-[#F1F4F2]', text: 'text-[#20313D]', border: 'border-[#B5C3CA]' },
    { id: 'sepia', name: 'Sepia', bg: 'bg-[#F7F3E9]', text: 'text-[#2D2721]', border: 'border-[#DECDB7]' },
    { id: 'white', name: 'White', bg: 'bg-white', text: 'text-slate-900', border: 'border-slate-300' },
    { id: 'night', name: 'Night', bg: 'bg-[#17222B]', text: 'text-slate-100', border: 'border-slate-700' }
  ];

  const fontSizes: { id: FontSize; label: string; desc: string }[] = [
    { id: 'sm', label: 'A', desc: 'Compact' },
    { id: 'base', label: 'A', desc: 'Default' },
    { id: 'lg', label: 'A', desc: 'Spacious' },
    { id: 'xl', label: 'A', desc: 'Large' }
  ];

  const speeds: { speed: number; label: string }[] = [
    { speed: 0.8, label: '0.8× (Slow)' },
    { speed: 1.0, label: '1.0× (Normal)' },
    { speed: 1.2, label: '1.2× (Fast)' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reading page display settings"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#B5C3CA]/40 shadow-xl overflow-hidden text-[#20313D] animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#B5C3CA]/30">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#365C78]" />
            <h3 className="font-semibold text-sm text-[#20313D]">
              Reading Page Display
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Paper Tint / Palette */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2.5">
              Page Atmosphere
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    t.bg
                  } ${t.border} ${
                    theme === t.id
                      ? 'ring-2 ring-[#365C78] ring-offset-2'
                      : 'hover:opacity-90'
                  }`}
                >
                  <span className={`text-xs font-medium ${t.text}`}>
                    {t.name}
                  </span>
                  {theme === t.id && (
                    <Check className="w-3.5 h-3.5 text-[#365C78]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Typography Scale */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2.5">
              Type Scale
            </label>
            <div className="grid grid-cols-4 gap-2 p-1.5 bg-[#F1F4F2] rounded-xl border border-[#B5C3CA]/30">
              {fontSizes.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontSize(f.id)}
                  className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                    fontSize === f.id
                      ? 'bg-white text-[#365C78] font-bold shadow-xs'
                      : 'text-[#657681] hover:text-[#20313D]'
                  }`}
                >
                  <div
                    className="font-serif-book mx-auto"
                    style={{ fontSize: `${13 + i * 2.5}px` }}
                  >
                    {f.label}
                  </div>
                  <span className="text-[10px] block opacity-80 mt-0.5">
                    {f.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typeface Style */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2.5">
              Typeface
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFontStyle('serif')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  fontStyle === 'serif'
                    ? 'border-[#365C78] bg-[#E3ECF0] text-[#365C78]'
                    : 'border-[#B5C3CA]/40 bg-white text-[#657681] hover:border-[#365C78]/40'
                }`}
              >
                <div className="font-serif-book font-semibold text-base mb-0.5">
                  Book Serif
                </div>
                <div className="text-[11px] opacity-80">
                  Source Serif 4, literary rhythm
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFontStyle('sans')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  fontStyle === 'sans'
                    ? 'border-[#365C78] bg-[#E3ECF0] text-[#365C78]'
                    : 'border-[#B5C3CA]/40 bg-white text-[#657681] hover:border-[#365C78]/40'
                }`}
              >
                <div className="font-sans font-semibold text-base mb-0.5">
                  Modern Sans
                </div>
                <div className="text-[11px] opacity-80">
                  Plus Jakarta Sans, crisp lines
                </div>
              </button>
            </div>
          </div>

          {/* Audio narration speed */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2.5">
              Narration Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              {speeds.map((s) => (
                <button
                  key={s.speed}
                  type="button"
                  onClick={() => setAudioSpeed(s.speed)}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    audioSpeed === s.speed
                      ? 'border-[#365C78] bg-[#365C78] text-white shadow-xs'
                      : 'border-[#B5C3CA]/40 bg-white text-[#657681] hover:text-[#20313D]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Highlight vocabulary toggle */}
          <div className="pt-2 border-t border-[#B5C3CA]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E6A653]" />
              <div>
                <div className="text-xs font-semibold text-[#20313D]">
                  Mark Key Vocabulary
                </div>
                <div className="text-[11px] text-[#657681]">
                  Subtle amber marker beneath graded words
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHighlightVocab(!highlightVocab)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                highlightVocab ? 'bg-[#365C78]' : 'bg-[#B5C3CA]'
              }`}
              aria-label="Toggle highlight vocabulary"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  highlightVocab ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
