import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Search, 
  ChevronRight, 
  BarChart3, 
  Globe2, 
  Briefcase,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { MOCK_INDUSTRIES } from '../data/mockIndustries';
import { IndustryInsight } from '../types';

interface IndustryInsightsViewProps {
  onAskAI: (prompt: string) => void;
}

export const IndustryInsightsView: React.FC<IndustryInsightsViewProps> = ({ onAskAI }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryInsight>(MOCK_INDUSTRIES[0]);

  const categories = ['All', 'Information Technology', 'Software Engineering', 'Security & Infrastructure', 'Data & Analytics', 'Product & Creative', 'Engineering & Sustainability', 'Life Sciences & Healthcare', 'Finance & Technology'];

  const filteredIndustries = MOCK_INDUSTRIES.filter((ind) => {
    const matchesSearch = ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.topRoles.some(r => r.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ind.emergingSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || ind.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/60 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Labor Market Intelligence</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Industry Growth, Demand & Salary Trends
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Real-world compensation benchmarks, annual industry growth rates, emerging skill demands, and high-density hiring regions to guide your career decisions.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#111112] rounded-2xl border border-white/5 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by role, skill, or field..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#161618] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {['All', 'AI & ML', 'Software', 'Cyber', 'Data', 'Design', 'Green Tech', 'FinTech'].map((label, idx) => {
            const fullCat = categories[idx] || 'All';
            return (
              <button
                key={label}
                onClick={() => setSelectedCategory(fullCat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === fullCat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#161618] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Industry Cards + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Industry Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredIndustries.map((ind) => {
            const isSelected = selectedIndustry.id === ind.id;
            return (
              <div
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`bg-[#161618] rounded-2xl p-5 border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {ind.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {ind.growthRate}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-white leading-snug">
                    {ind.name}
                  </h3>

                  {/* Salary Summary */}
                  <div className="mt-3 p-2.5 bg-[#111112] rounded-xl border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Starting Salary:</span>
                      <span className="font-bold text-indigo-400">{ind.averageStartingSalary}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Senior Tier:</span>
                      <span className="font-bold text-gray-200">{ind.averageSeniorSalary}</span>
                    </div>
                  </div>

                  {/* Top Roles Preview */}
                  <div className="mt-3">
                    <p className="text-[11px] font-bold text-gray-500 mb-1">Key In-Demand Roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {ind.topRoles.slice(0, 3).map((r, rIdx) => (
                        <span key={rIdx} className="text-[10px] bg-[#1f1f23] text-gray-300 px-2 py-0.5 rounded font-medium border border-white/5">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-bold ${
                    ind.demandLevel === 'Very High' ? 'text-rose-400' : 'text-indigo-400'
                  }`}>
                    ● {ind.demandLevel} Demand
                  </span>
                  <span className="text-indigo-400 font-bold flex items-center space-x-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Detailed Inspector Panel */}
        <div className="space-y-6">
          <div className="bg-[#161618] rounded-2xl border border-white/5 p-6 shadow-xs space-y-5 sticky top-24">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {selectedIndustry.category}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {selectedIndustry.growthRate}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-white mt-1">
                {selectedIndustry.name}
              </h2>
            </div>

            {/* Overview text */}
            <p className="text-xs text-gray-400 leading-relaxed">
              {selectedIndustry.marketOverview}
            </p>

            {/* Compensation Details */}
            <div className="p-3.5 bg-[#111112] rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                <span>Verified Compensation Bands</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">Entry / Student</p>
                  <p className="font-bold text-indigo-400">{selectedIndustry.averageStartingSalary}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold">Senior Specialist</p>
                  <p className="font-bold text-gray-200">{selectedIndustry.averageSeniorSalary}</p>
                </div>
              </div>
            </div>

            {/* Emerging Skills Radar */}
            <div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Trending & Emerging Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedIndustry.emergingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#1f1f23] text-gray-300 px-2.5 py-1 rounded-lg border border-white/10 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Hubs */}
            <div>
              <h4 className="text-xs font-bold text-white mb-2 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Major Geographic Hiring Hubs</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedIndustry.hiringHubs.map((hub, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#111112] text-gray-400 px-2 py-0.5 rounded-md border border-white/5"
                  >
                    {hub}
                  </span>
                ))}
              </div>
            </div>

            {/* Future Outlook */}
            <div className="p-3 bg-[#111112] rounded-xl border border-white/5 text-xs text-gray-400">
              <p className="font-bold text-gray-200 mb-1">Future Outlook:</p>
              <p>{selectedIndustry.futureOutlook}</p>
            </div>

            {/* Action: Ask AI about this industry */}
            <button
              onClick={() => onAskAI(`Give me a detailed breakdown of breaking into the ${selectedIndustry.name} industry as a student, including target company tiers, must-know questions, and salary negotiation tactics.`)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Advisor About {selectedIndustry.name.slice(0, 18)}...</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
