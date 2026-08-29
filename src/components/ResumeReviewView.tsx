import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Check, 
  HelpCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { ResumeReviewResult, User } from '../types';

interface ResumeReviewViewProps {
  currentUser: User | null;
  onAskAI: (prompt: string) => void;
}

const SAMPLE_RESUMES = {
  cs: `Alex Chen
alex.chen@university.edu | github.com/alexchen | linkedin.com/in/alexchen-dev

EDUCATION
State University — B.S. in Computer Science (Expected May 2026) | GPA: 3.82

TECHNICAL SKILLS
Languages: Python, TypeScript, Java, C++, SQL
Frameworks & Tools: React, Node.js, Express, Docker, Git, PyTorch, Tailwind CSS

PROJECTS & EXPERIENCE
Student Portal Redesign | Software Engineering Intern (Summer 2024)
- Worked on the frontend of the student portal using React and JavaScript.
- Helped build the backend database and wrote SQL queries for student registrations.
- Created unit tests to check if the code works.

AI Document Search Engine | Personal Project (2024)
- Built a web app where users can upload PDFs and ask questions.
- Used Python, FastAPI, and ChromaDB vector database.
- Hosted project on AWS EC2.`,

  design: `Maya Patel
maya.patel@designhub.org | mayapatel.design | linkedin.com/in/mayapatel-ux

EDUCATION
Polytechnic Institute — B.S. in Human-Computer Interaction (Class of 2025)

SKILLS & TOOLS
Design: Figma, Wireframing, User Journey Mapping, Design Systems, Usability Testing
Technical: HTML5, CSS3, Tailwind, Basic React, Web Accessibility (WCAG 2.1)

EXPERIENCE
UX Design Intern | FinTech Startup (2024)
- Designed new onboarding screens for mobile banking app in Figma.
- Talked to 10 users to get feedback on the new checkout flow.
- Collaborated with engineering team to deliver design assets.`,

  business: `Jordan Taylor
jordan.taylor@biztech.edu | linkedin.com/in/jordantaylor-biz

EDUCATION
Tech Forward Academy — Business Analytics & Data Foundations (2024)
State College — B.A. in Business Administration (2023)

SKILLS
Data Analysis: SQL, Python (Pandas), Excel Modeling, Tableau, A/B Testing
Business: Financial Modeling, Strategic Roadmapping, Stakeholder Communication

EXPERIENCE
Operations Analyst | Logistics Co. (2023 - 2024)
- Managed inventory spreadsheets and updated daily stock records.
- Created quarterly performance presentation slides for management.
- Assisted in customer retention survey analysis.`
};

export const ResumeReviewView: React.FC<ResumeReviewViewProps> = ({ currentUser, onAskAI }) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.cs);
  const [targetRole, setTargetRole] = useState(currentUser?.profile?.targetRole || 'Software Engineer');
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ResumeReviewResult | null>(null);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);

  const handleReview = async () => {
    if (!resumeText.trim() || resumeText.length < 20) return;
    setIsReviewing(true);

    try {
      const res = await fetch('/api/career/resume-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          studentMajor: currentUser?.profile?.major || 'STEM'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to review resume.');
      setReviewResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyImproved = (improvedText: string, idx: number) => {
    navigator.clipboard.writeText(improvedText);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/60 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>AI Technical Recruiter Review</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Resume & Bullet Point Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Audit your student resume against ATS parsing algorithms, replace passive phrases with quantifiable X-Y-Z impact statements, and uncover missing keywords.
          </p>
        </div>
      </div>

      {/* Input & Role Selector Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Resume Input Area */}
        <div className="lg:col-span-5 bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs flex flex-col space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Machine Learning Engineer"
                className="mt-1 px-3 py-1.5 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 w-full"
              />
            </div>

            {/* Quick Sample Selector */}
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Load Sample:</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUMES.cs)}
                  className="px-2 py-1 bg-[#111112] hover:bg-white/5 text-[10px] font-bold rounded-lg text-gray-400 hover:text-white border border-white/5"
                >
                  CS Tech
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUMES.design)}
                  className="px-2 py-1 bg-[#111112] hover:bg-white/5 text-[10px] font-bold rounded-lg text-gray-400 hover:text-white border border-white/5"
                >
                  UI/UX
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUMES.business)}
                  className="px-2 py-1 bg-[#111112] hover:bg-white/5 text-[10px] font-bold rounded-lg text-gray-400 hover:text-white border border-white/5"
                >
                  Data/Biz
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Resume Text / Project Bullets
            </label>
            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume sections, project bullet points, or experience descriptions here..."
              className="flex-1 w-full p-3 text-xs font-mono text-gray-200 rounded-xl bg-[#111112] border border-white/10 focus:outline-none focus:border-indigo-500/50 resize-none placeholder:text-gray-600"
            />
          </div>

          <button
            onClick={handleReview}
            disabled={isReviewing || !resumeText.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {isReviewing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Technical Recruiter is Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit & Optimize Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Right 7 Cols: Results & Bullet Improvements */}
        <div className="lg:col-span-7 space-y-6">
          {reviewResult ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Scorecard Bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Overall Score</span>
                  <p className={`text-2xl font-display font-bold mt-0.5 ${
                    reviewResult.overallScore >= 80 ? 'text-emerald-400' : reviewResult.overallScore >= 65 ? 'text-indigo-400' : 'text-amber-400'
                  }`}>
                    {reviewResult.overallScore}/100
                  </p>
                </div>

                <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ATS Readability</span>
                  <p className="text-2xl font-display font-bold text-indigo-400 mt-0.5">
                    {reviewResult.atsReadabilityScore}%
                  </p>
                </div>

                <div className="bg-[#161618] p-4 rounded-2xl border border-white/5 shadow-xs text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Impact (X-Y-Z)</span>
                  <p className="text-2xl font-display font-bold text-purple-400 mt-0.5">
                    {reviewResult.impactScore}%
                  </p>
                </div>
              </div>

              {/* Summary Feedback */}
              <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 shadow-xs space-y-3">
                <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Recruiter Assessment Summary</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {reviewResult.summaryFeedback}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                    <p className="text-[11px] font-bold text-emerald-300 mb-1">Key Strengths</p>
                    <ul className="text-xs text-emerald-200 space-y-1">
                      {reviewResult.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl">
                    <p className="text-[11px] font-bold text-rose-300 mb-1">Areas for Growth</p>
                    <ul className="text-xs text-rose-200 space-y-1">
                      {reviewResult.weaknesses.map((w, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-rose-400">!</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Before & After Bullet Point Rewrites */}
              <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-display font-bold text-sm text-white">
                      High-Impact Bullet Rewrites (Google X-Y-Z Formula)
                    </h3>
                  </div>
                  <span className="text-[10px] text-indigo-300 font-bold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                    Quantified Impact
                  </span>
                </div>

                <div className="space-y-4">
                  {reviewResult.bulletImprovements.map((b, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#111112] border border-white/5 space-y-2">
                      <div className="text-xs text-rose-300 bg-rose-950/30 p-2.5 rounded-lg border border-rose-500/30">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-rose-400 block mb-0.5">Original (Passive):</span>
                        <p className="line-through">{b.original}</p>
                      </div>

                      <div className="text-xs text-emerald-200 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-400">AI Improved (Impact-Driven):</span>
                          <button
                            onClick={() => handleCopyImproved(b.improved, idx)}
                            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-200 flex items-center space-x-1"
                          >
                            {copiedBulletIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-medium">{b.improved}</p>
                      </div>

                      <p className="text-[11px] text-gray-500 italic px-1">
                        Reason: {b.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing ATS Keywords */}
              <div className="bg-[#161618] p-5 rounded-2xl border border-white/5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-display font-bold text-xs text-white">
                    Recommended ATS Keywords for {targetRole}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {reviewResult.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-[#1f1f23] text-indigo-300 px-2.5 py-1 rounded-lg border border-white/10 font-medium"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[350px] bg-[#161618] rounded-2xl border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Ready for Technical Recruiter Analysis
              </h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Paste your resume text on the left and click "Audit & Optimize Resume" to receive quantified scores, bullet rewrites, and keyword gaps.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
