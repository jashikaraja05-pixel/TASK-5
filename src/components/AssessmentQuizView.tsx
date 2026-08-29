import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Target, 
  Award, 
  Briefcase,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, calculateQuizResults } from '../data/quizQuestions';
import { QuizResult, User } from '../types';

interface AssessmentQuizViewProps {
  currentUser: User | null;
  onSetTargetRole: (role: string, industry: string) => void;
  onAskAI: (prompt: string) => void;
}

export const AssessmentQuizView: React.FC<AssessmentQuizViewProps> = ({
  currentUser,
  onSetTargetRole,
  onAskAI
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = { ...answers, [currentQ.id]: optionIndex };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate results and trigger confetti
      const res = calculateQuizResults(updatedAnswers);
      setResult(res);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  const progressPercentage = Math.round(((currentQuestionIndex + (result ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 text-center sm:text-left">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/60 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Career Aptitude & Discovery Diagnostic</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Find Your Aligned Career Path
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Answer 6 targeted scenario questions to uncover your core cognitive traits, industry strengths, and highest-match technical careers.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-indigo-400 font-semibold">{currentQ.category}</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h2 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-[#111112] border-white/5 hover:border-white/15 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1f1f23] text-gray-300 border border-white/10'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs text-gray-200 font-medium leading-relaxed">
                      {option.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 shrink-0 ml-2" />
                </button>
              );
            })}
          </div>

          {/* Back Button if not on first question */}
          {currentQuestionIndex > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="text-xs text-gray-500 hover:text-white font-semibold"
              >
                ← Back to previous question
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results Section */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Summary Banner */}
          <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="font-display font-bold text-base text-white">
                  Your Cognitive Profile & Strengths
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-white font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {result.summary}
            </p>

            {/* Dominant Traits Bar Graph */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {result.dominantTraits.slice(0, 3).map((t, idx) => (
                <div key={idx} className="p-3 bg-[#111112] rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-200">{t.trait}</span>
                    <span className="text-indigo-400">{t.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Career Recommendations */}
          <div>
            <h3 className="font-display font-bold text-base text-white mb-3">
              Top Recommended Career Pathways
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.recommendedCareers.map((career, idx) => (
                <div
                  key={idx}
                  className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-white/15 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                        {career.industry}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {career.matchScore}% Match
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm text-white leading-snug">
                      {career.title}
                    </h4>

                    <p className="text-xs text-gray-400">
                      {career.description}
                    </p>

                    <div className="p-2.5 bg-[#111112] rounded-xl border border-white/5 text-xs">
                      <span className="text-gray-500 font-medium block text-[10px]">Expected Pay:</span>
                      <span className="font-bold text-indigo-400">{career.averageSalary}</span>
                    </div>

                    <p className="text-[11px] text-gray-500 pt-1">
                      <strong className="text-gray-300 font-semibold">Entry Prep:</strong> {career.entryRequirements}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onSetTargetRole(career.title, career.industry)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Set as My Target Goal</span>
                    </button>

                    <button
                      onClick={() => onAskAI(`I scored a ${career.matchScore}% match for ${career.title}. Give me an actionable 30-day starter plan to begin learning right now.`)}
                      className="w-full py-1.5 bg-[#111112] hover:bg-white/5 text-gray-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1 border border-white/5"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Ask AI Advisor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
