import React, { useState } from 'react';
import { X, Save, Plus, Trash2, CheckCircle, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { User, StudentProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpdateProfile: (updatedProfile: StudentProfile, updatedName: string) => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile
}) => {
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [profile, setProfile] = useState<StudentProfile>({ ...currentUser.profile });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.currentSkills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        currentSkills: [...profile.currentSkills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      currentSkills: profile.currentSkills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interestToRemove)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateProfile(profile, name);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#161618] rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#111112]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Student Profile & Career Goals
              </h3>
              <p className="text-xs text-gray-400">
                The AI Career Advisor uses this profile to generate personalized plans.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Education Level</label>
              <select
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate (B.S. / B.A.)</option>
                <option value="Graduate">Graduate (M.S. / Ph.D. / MBA)</option>
                <option value="Bootcamp / Self-Taught">Bootcamp / Self-Taught</option>
                <option value="Career Switcher">Career Switcher</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Major / Field of Study</label>
              <input
                type="text"
                value={profile.major}
                onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                placeholder="e.g. Computer Science, Biotechnology"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Institution & Grad Year</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={profile.institution || ''}
                  onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                  placeholder="e.g. UC Berkeley"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="text"
                  value={profile.graduationYear || ''}
                  onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                  placeholder="Year (e.g. 2026)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Career Targets */}
          <div className="p-4 bg-[#111112] rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Career Ambition & Preferences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Target Dream Role</label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#161618] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Target Industry</label>
                <input
                  type="text"
                  value={profile.targetIndustry}
                  onChange={(e) => setProfile({ ...profile, targetIndustry: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Robotics"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#161618] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Work Mode</label>
                <select
                  value={profile.preferredWorkMode}
                  onChange={(e) => setProfile({ ...profile, preferredWorkMode: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#161618] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Flexible">Flexible / Open</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Target Location</label>
                <input
                  type="text"
                  value={profile.targetLocation || ''}
                  onChange={(e) => setProfile({ ...profile, targetLocation: e.target.value })}
                  placeholder="e.g. San Francisco, New York, or Remote"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#161618] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Current Skills (Tags) */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">
              Current Skills & Proficiencies ({profile.currentSkills.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {profile.currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-950/60 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/30"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-white ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                placeholder="Type a skill and press Enter (e.g. PyTorch, SQL, Figma)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-[#111112] hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 border border-white/5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Interests (Tags) */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">
              Passions & Sub-Fields ({profile.interests.length})
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#1f1f23] text-sky-300 text-xs font-medium rounded-lg border border-white/10"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-sky-400 hover:text-white ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                placeholder="Type an interest (e.g. Autonomous Driving, Green Tech, FinTech)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-3 py-1.5 bg-[#111112] hover:bg-white/5 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 border border-white/5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Bio / Summary */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Short Bio & Background</label>
            <textarea
              rows={2}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell the AI advisor any specific career questions, constraints, or unique goals..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#111112] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : savedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Profile Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
