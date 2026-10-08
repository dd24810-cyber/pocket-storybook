import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import { ComprehensionQuestion } from '../types';

interface ComprehensionQuizProps {
  questions: ComprehensionQuestion[];
  onComplete: (score: number) => void;
  savedScore?: number;
}

export const ComprehensionQuiz: React.FC<ComprehensionQuizProps> = ({
  questions,
  onComplete,
  savedScore
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(savedScore !== undefined);

  const handleSelect = (qIdx: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setSubmitted(true);
    onComplete(score);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const currentScore = submitted ? (savedScore !== undefined ? savedScore : calculateScore()) : 0;

  return (
    <div className="bg-[#FFFFFF] border border-[#B5C3CA]/40 rounded-2xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#B5C3CA]/20">
        <div>
          <h3 className="font-serif-book text-xl font-semibold text-[#20313D] tracking-tight">
            Comprehension Check
          </h3>
          <p className="text-xs text-[#657681] mt-0.5">
            Test your understanding of the story narrative and key details
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E3ECF0] rounded-xl text-[#365C78]">
            <Award className="w-4 h-4 text-[#E6A653]" />
            <span className="text-xs font-semibold">
              Score: {currentScore} / {questions.length}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const isCorrect = selected === q.answerIndex;

          return (
            <div
              key={q.id}
              className="p-4 sm:p-5 rounded-xl bg-[#F1F4F2]/50 border border-[#B5C3CA]/30 space-y-3"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#E3ECF0] text-[#365C78] text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-medium text-[#20313D] leading-snug">
                  {q.question}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                {q.options.map((option, optIdx) => {
                  let buttonStyle = 'bg-white border-[#B5C3CA]/40 text-[#20313D] hover:border-[#365C78]/60';

                  if (submitted) {
                    if (optIdx === q.answerIndex) {
                      buttonStyle = 'bg-[#356A58]/10 border-[#356A58] text-[#356A58] font-semibold';
                    } else if (selected === optIdx && optIdx !== q.answerIndex) {
                      buttonStyle = 'bg-red-50 border-red-300 text-red-700';
                    } else {
                      buttonStyle = 'bg-white/60 border-slate-200 text-slate-400';
                    }
                  } else if (selected === optIdx) {
                    buttonStyle = 'bg-[#E3ECF0] border-[#365C78] text-[#365C78] font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {submitted && optIdx === q.answerIndex && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#356A58] shrink-0 ml-1.5" />
                      )}
                      {submitted && selected === optIdx && optIdx !== q.answerIndex && (
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 ml-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="pl-9 pt-1 text-xs text-[#657681] italic">
                  💡 {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[#B5C3CA]/20 flex items-center justify-between">
        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#365C78] hover:bg-[#2c4b63] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            Check Answers
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-[#657681]">
              {currentScore === questions.length
                ? '🌟 Perfect score! You grasped all narrative details.'
                : 'Great effort! Review the explanations above.'}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-[#365C78] hover:bg-[#E3ECF0] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
