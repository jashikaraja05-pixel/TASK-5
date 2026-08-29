import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Award, 
  Code2, 
  Layers, 
  ChevronRight, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  Filter,
  Plus
} from 'lucide-react';
import { CareerRoadmap, User } from '../types';
import { DEFAULT_ROADMAPS } from '../data/defaultRoadmaps';

interface RoadmapViewProps {
  currentUser: User | null;
  onAskAI: (prompt: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ currentUser, onAskAI }) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('ai-engineer');
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap>(DEFAULT_ROADMAPS['ai-engineer']);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSelectTrack = (trackKey: string) => {
    setSelectedTrack(trackKey);
    if (DEFAULT_ROADMAPS[trackKey]) {
      setActiveRoadmap(DEFAULT_ROADMAPS[trackKey]);
    }
  };

  const handleGenerateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoleInput.trim()) return;
    setIsGeneratingCustom(true);

    try {
      const res = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: customRoleInput.trim(),
          industry: currentUser?.profile?.targetIndustry || 'Technology',
          currentSkills: currentUser?.profile?.currentSkills || [],
          experienceLevel: currentUser?.profile?.experienceLevel || 'Entry-Level / Student',
          timeframe: '6 - 9 Months'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate custom roadmap.');
      setActiveRoadmap(data);
      setSelectedTrack('custom');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  // Calculate overall milestone completion
  const totalMilestones = activeRoadmap.phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const finishedCount = activeRoadmap.phases.reduce(
    (acc, p) => acc + p.milestones.filter(m => completedMilestones[m.id]).length,
    0
  );
  const progressPercent = totalMilestones > 0 ? Math.round((finishedCount / totalMilestones) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/60 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Career Pathways</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Curated Career Roadmaps & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Detailed step-by-step learning phases, foundational concepts, capstone projects, and industry certifications to take you from student to hire-ready.
          </p>

          {/* Progress Summary Card */}
          <div className="mt-6 p-4 bg-white/5 backdrop-blur rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold">Active Pathway Progress</p>
              <h3 className="text-base font-bold text-white flex items-center space-x-2 mt-0.5">
                <span>{activeRoadmap.roleTitle}</span>
                <span className="text-xs bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {activeRoadmap.estimatedTimeline}
                </span>
              </h3>
            </div>

            <div className="w-full sm:w-64">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-400">{finishedCount} of {totalMilestones} Milestones</span>
                <span className="text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Tracks & Custom Generator Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#111112] p-4 rounded-2xl border border-white/5 shadow-xs">
        
        {/* Preset Role Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Tracks:</span>
          </span>
          {[
            { id: 'ai-engineer', label: 'AI & ML Engineer' },
            { id: 'fullstack-engineer', label: 'Full-Stack Developer' },
            { id: 'data-scientist', label: 'Data Science & Analytics' },
            { id: 'cybersecurity-analyst', label: 'Cybersecurity Analyst' }
          ].map((track) => (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(track.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedTrack === track.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-[#161618] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Generate Custom Role Roadmap via AI */}
        <form onSubmit={handleGenerateCustom} className="flex items-center space-x-2">
          <input
            type="text"
            value={customRoleInput}
            onChange={(e) => setCustomRoleInput(e.target.value)}
            placeholder="Generate any role (e.g. Cloud Architect, Bioinformatician)..."
            className="w-full sm:w-64 px-3 py-1.5 text-xs rounded-xl bg-[#161618] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
          />
          <button
            type="submit"
            disabled={isGeneratingCustom || !customRoleInput.trim()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 shrink-0"
          >
            {isGeneratingCustom ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Generate</span>
          </button>
        </form>
      </div>

      {/* Roadmap Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step-by-Step Phases */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">
              Curriculum Phases & Milestones
            </h2>
            <button
              onClick={() => onAskAI(`Explain the hardest concepts in Phase 1 of the ${activeRoadmap.roleTitle} roadmap in detail.`)}
              className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI Tutor About Phase 1</span>
            </button>
          </div>

          <div className="space-y-4">
            {activeRoadmap.phases.map((phase) => (
              <div
                key={phase.phaseNumber}
                className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs hover:border-indigo-500/30 transition-colors"
              >
                {/* Phase Header */}
                <div className="flex items-start justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-950/50 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                      P{phase.phaseNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {phase.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-gray-400 bg-[#111112] px-2 py-0.5 rounded-lg shrink-0 border border-white/5">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>{phase.duration}</span>
                  </span>
                </div>

                {/* Milestones Checklist */}
                <div className="pt-3 space-y-2.5">
                  {phase.milestones.map((milestone) => {
                    const isDone = !!completedMilestones[milestone.id];
                    return (
                      <div
                        key={milestone.id}
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                            : 'bg-[#111112] border-white/5 hover:border-white/10 text-gray-300'
                        }`}
                      >
                        <button className="mt-0.5 shrink-0 text-gray-500 hover:text-emerald-400">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-600" />
                          )}
                        </button>

                        <div className="flex-1">
                          <h4 className={`text-xs font-bold ${isDone ? 'line-through text-emerald-400' : 'text-gray-200'}`}>
                            {milestone.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {milestone.description}
                          </p>

                          {milestone.resources && milestone.resources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {milestone.resources.map((res, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center space-x-1 text-[10px] bg-[#1f1f23] text-indigo-300 px-2 py-0.5 rounded border border-white/10 font-medium"
                                >
                                  <BookOpen className="w-2.5 h-2.5 text-indigo-400" />
                                  <span>{res}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Projects & Certifications */}
        <div className="space-y-6">
          
          {/* Recommended Capstone Projects */}
          <div className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  High-Impact Projects
                </h3>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Portfolio</span>
            </div>

            <div className="space-y-3">
              {activeRoadmap.recommendedProjects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#111112] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-200 leading-tight">
                      {proj.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                      proj.difficulty === 'Advanced' ? 'bg-purple-950/60 text-purple-300 border border-purple-500/30' : 'bg-sky-950/60 text-sky-300 border border-sky-500/30'
                    }`}>
                      {proj.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-semibold bg-[#1f1f23] text-gray-300 px-1.5 py-0.5 rounded border border-white/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onAskAI(`How can I build the "${proj.title}" project step-by-step using ${proj.techStack.join(', ')}?`)}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 pt-1"
                  >
                    <span>Get AI Implementation Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Key Industry Certifications */}
          <div className="bg-[#161618] rounded-2xl border border-white/5 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Target Certifications
                </h3>
              </div>
              <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Validated</span>
            </div>

            <div className="space-y-2">
              {activeRoadmap.keyCertifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold text-amber-200 text-[11px]">{cert}</span>
                  </div>
                  <button
                    onClick={() => onAskAI(`How should a student prepare for the "${cert}" certification exam? What free study guides exist?`)}
                    title="Ask AI how to prep"
                    className="text-amber-400 hover:text-amber-300 text-[10px] font-bold shrink-0 ml-2"
                  >
                    Prep Guide
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
