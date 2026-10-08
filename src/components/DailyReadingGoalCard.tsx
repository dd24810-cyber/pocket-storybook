import React, { useState } from 'react';
import {
  Target,
  Flame,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  Clock,
  Settings2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useReading } from '../context/ReadingContext';

interface DailyReadingGoalCardProps {
  compact?: boolean;
}

export const DailyReadingGoalCard: React.FC<DailyReadingGoalCardProps> = ({ compact = false }) => {
  const {
    dailyGoalMinutes,
    setDailyGoalMinutes,
    todayReadingSeconds,
    todayReadingMinutes,
    recordReadingSeconds,
    streakDays
  } = useReading();

  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Exact progress calculation including partial minutes
  const goalSeconds = Math.max(60, dailyGoalMinutes * 60);
  const rawProgressPercent = (todayReadingSeconds / goalSeconds) * 100;
  const progressPercent = Math.min(100, Math.round(rawProgressPercent));
  const isGoalAchieved = todayReadingSeconds >= goalSeconds;

  // SVG circular progress calculation
  const circleSize = compact ? 88 : 108;
  const strokeWidth = compact ? 7 : 8.5;
  const center = circleSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, rawProgressPercent) / 100) * circumference;

  const remainingMinutes = Math.max(0, dailyGoalMinutes - todayReadingMinutes);

  // Quick preset targets
  const presets = [5, 10, 15, 20, 30];

  const handleAdjustGoal = (delta: number) => {
    const updated = Math.max(5, Math.min(120, dailyGoalMinutes + delta));
    setDailyGoalMinutes(updated);
  };

  const handleQuickAddFiveMinutes = () => {
    recordReadingSeconds(300); // 5 minutes
  };

  return (
    <section
      aria-label="Daily reading goal tracker"
      className="bg-white rounded-3xl border border-[#B5C3CA]/40 p-5 sm:p-7 shadow-2xs mb-8 transition-all relative overflow-hidden"
    >
      {/* Delicate background decorative accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#E3ECF0]/40 via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        {/* Left Side: Progress Circle & Daily Metrics */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Circular Donut Progress Chart */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={circleSize}
              height={circleSize}
              className="transform -rotate-90 origin-center"
              aria-hidden="true"
            >
              {/* Background Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="stroke-[#E3ECF0]"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Progress Stroke */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className={`transition-all duration-700 ease-out ${
                  isGoalAchieved ? 'stroke-[#356A58]' : 'stroke-[#E6A653]'
                }`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Stat Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
              {isGoalAchieved ? (
                <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
                  <CheckCircle className="w-6 h-6 text-[#356A58] fill-[#356A58]/20" />
                  <span className="text-[10px] font-bold text-[#356A58] tracking-wider uppercase mt-0.5">
                    Met!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-serif-book text-2xl font-bold text-[#20313D] leading-none tabular-nums">
                    {todayReadingMinutes}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-[#657681] mt-0.5">
                    of {dailyGoalMinutes}m
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Goal Information & Motivation */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#365C78] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#E6A653]" />
                Daily Reading Goal
              </span>
              <span aria-hidden="true" className="text-[#B5C3CA]">·</span>
              <span className="text-xs font-semibold text-[#E6A653] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#E6A653]" />
                {streakDays}-day streak
              </span>
            </div>

            <h2 className="font-serif-book text-xl sm:text-2xl font-semibold text-[#20313D] tracking-tight">
              {todayReadingMinutes} of {dailyGoalMinutes} minutes read today
            </h2>

            <p className="text-xs text-[#657681] mt-1 flex items-center gap-2">
              {isGoalAchieved ? (
                <span className="text-[#356A58] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Goal achieved! You've met your daily reading target.
                </span>
              ) : (
                <span>
                  <strong className="text-[#20313D] font-semibold">{remainingMinutes} min</strong> remaining to hit today’s target ({progressPercent}% achieved).
                </span>
              )}
            </p>

            {/* Quick reading progress bar under headline for quick visualization */}
            <div className="w-48 sm:w-64 h-1.5 bg-[#E3ECF0] rounded-full overflow-hidden mt-2.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isGoalAchieved ? 'bg-[#356A58]' : 'bg-gradient-to-r from-[#365C78] to-[#E6A653]'
                }`}
                style={{ width: `${Math.min(100, rawProgressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Target Settings & Fast Presets */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#B5C3CA]/25">
          {/* Target Adjuster / Stepper */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#657681] font-medium mr-1">Daily Target:</span>
            <div className="inline-flex items-center bg-[#F1F4F2] border border-[#B5C3CA]/40 rounded-xl p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => handleAdjustGoal(-5)}
                disabled={dailyGoalMinutes <= 5}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Decrease daily goal by 5 minutes"
                aria-label="Decrease daily goal by 5 minutes"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              
              <span className="px-3 text-xs font-serif-book font-bold text-[#20313D] tabular-nums min-w-[56px] text-center">
                {dailyGoalMinutes} min
              </span>

              <button
                type="button"
                onClick={() => handleAdjustGoal(5)}
                disabled={dailyGoalMinutes >= 120}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Increase daily goal by 5 minutes"
                aria-label="Increase daily goal by 5 minutes"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#657681] mr-1 hidden sm:inline">Presets:</span>
            {presets.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoalMinutes(mins)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                  dailyGoalMinutes === mins
                    ? 'bg-[#365C78] text-white shadow-2xs'
                    : 'bg-[#E3ECF0]/70 text-[#365C78] hover:bg-[#E3ECF0] hover:text-[#20313D]'
                }`}
                title={`Set daily reading goal to ${mins} minutes`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Offline / Quick Log Helper */}
          <div className="flex items-center gap-2 text-xs text-[#657681]">
            <button
              type="button"
              onClick={handleQuickAddFiveMinutes}
              className="text-[11px] text-[#365C78] hover:text-[#20313D] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              title="Log 5 minutes of offline reading"
            >
              <Plus className="w-3 h-3 text-[#E6A653]" />
              <span>Log +5 min reading</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
