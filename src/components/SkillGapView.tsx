import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { SkillGapAnalysis, User } from '../types';

interface SkillGapViewProps {
  currentUser: User | null;
  onAskAI: (prompt: string) => void;
  onAddSkillToProfile: (skill: string) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  currentUser,
  onAskAI,
  onAddSkillToProfile
}) => {
  const [targetRole, setTargetRole] = useState(currentUser?.profile?.targetRole || 'Machine Learning Engineer');
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSkillGap = async (roleToAnalyze: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/career/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: roleToAnalyze,
          currentSkills: currentUser?.profile?.currentSkills || ['Python', 'SQL', 'Git'],
          educationLevel: currentUser?.profile?.educationLevel || 'Undergraduate'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze skills.');
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(targetRole);
  }, [currentUser?.profile?.currentSkills]);

  const handleRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    fetchSkillGap(newRole);
  };

  const handleQuickAddSkill = (skill: string) => {
    onAddSkillToProfile(skill);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
            <Target className="w-3.5 h-3.5" />
            <span>AI Competency Diagnostic</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Skill Gap Matrix & Learning Strategy
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Compare your active student skill set directly against real hiring requirements, identify missing critical proficiencies, and discover high-yield study resources.
          </p>
        </div>
      </div>

      {/* Target Role Selector & Profile Overview */}
      <div className="bg-[#111112] rounded-2xl border border-white/5 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500 mb-2">
            Analyzing Target Benchmark Role
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Machine Learning Engineer',
              'Full-Stack Developer',
              'Data Scientist',
              'Cloud Solutions Architect',
              'Cybersecurity Analyst',
              'Product Designer (UI/UX)'
            ].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  targetRole === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#161618] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => fetchSkillGap(targetRole)}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition-colors flex items-center space-x-1.5 shrink-0"
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Re-Analyze Profile</span>
        </button>
      </div>

      {/* Main Analysis Display */}
      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Match Score & Current vs Missing Skills */}
          <div className="space-y-6">
            
            {/* Match Gauge Card */}
            <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 shadow-xs text-center space-y-4">
              <div className="inline-flex items-center justify-center relative">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#27272a"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke={analysis.matchScore > 75 ? '#10b981' : analysis.matchScore > 50 ? '#6366f1' : '#f59e0b'}
                    strokeWidth="12"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * analysis.matchScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">
                    {analysis.matchScore}%
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Role Match
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">
                  {analysis.matchScore > 75
                    ? 'Strong Skill Alignment'
                    : analysis.matchScore > 50
                    ? 'Solid Foundation (Gaps Exist)'
                    : 'Early Stage Transition'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Based on {currentUser?.profile?.currentSkills.length || 0} skills on your student profile for {targetRole}.
                </p>
              </div>
            </div>

            {/* Matching Verified Skills */}
            <div className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-display font-bold text-xs text-white">
                    Your Matching Skills ({analysis.matchingSkills.length})
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                  Verified
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {analysis.matchingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-950/30 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Skills with Quick Add */}
            <div className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="font-display font-bold text-xs text-white">
                    High-Priority Skill Gaps ({analysis.missingCriticalSkills.length})
                  </h4>
                </div>
                <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                  High Impact
                </span>
              </div>

              <div className="space-y-2">
                {analysis.missingCriticalSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-amber-200">{skill}</span>
                    <button
                      onClick={() => handleQuickAddSkill(skill)}
                      title="Add to my skills list"
                      className="text-[11px] text-indigo-300 hover:text-indigo-100 font-bold flex items-center space-x-0.5 bg-[#111112] px-2 py-0.5 rounded border border-white/10"
                    >
                      <Plus className="w-3 h-3" />
                      <span>I know this</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right 2 Columns: Actionable Learning Plan & Portfolio Tips */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step-by-Step Learning Plan */}
            <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-display font-bold text-sm text-white">
                    Prioritized Learning Plan & Resources
                  </h3>
                </div>
                <button
                  onClick={() => onAskAI(`Generate a detailed 4-week study plan to master ${analysis.missingCriticalSkills.join(', ')} for ${targetRole}.`)}
                  className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate 4-Week Schedule</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {analysis.learningPlan.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#111112] border border-white/5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-950/60 text-indigo-400 text-xs font-bold flex items-center justify-center border border-indigo-500/20">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-xs text-white">
                          {item.skill}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.priority === 'High' ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30' : 'bg-sky-950/60 text-sky-300 border border-sky-500/30'
                        }`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span>~{item.estimatedHours} hrs</span>
                        </span>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-1.5">
                      {item.recommendedResources.map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex items-center justify-between p-2 bg-[#161618] rounded-lg border border-white/5 text-xs"
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                              {res.type}
                            </span>
                            <span className="font-medium text-gray-300 truncate">{res.name}</span>
                          </div>
                          <span className="text-[11px] text-indigo-400 font-semibold shrink-0 ml-2">
                            {res.platform}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Impact Portfolio Recommendations */}
            <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Portfolio Advice to Bridge Experience Gaps
                </h3>
              </div>

              <div className="space-y-2">
                {analysis.portfolioAdvice.map((advice, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#111112] border border-white/5 flex items-start space-x-2.5 text-xs text-gray-300 leading-relaxed"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{advice}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
