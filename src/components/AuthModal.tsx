import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onSwitchDemoUser: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchDemoUser
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'demo'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [educationLevel, setEducationLevel] = useState<'High School' | 'Undergraduate' | 'Graduate' | 'Bootcamp / Self-Taught' | 'Career Switcher'>('Undergraduate');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');
        onLoginSuccess(data.user);
        onClose();
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name,
            profile: {
              educationLevel,
              major: major || 'General Studies',
              interests: ['Technology', 'Career Advancement'],
              currentSkills: ['Problem Solving', 'Communication'],
              targetRole: targetRole || 'Software Engineer',
              targetIndustry: 'Information Technology',
              preferredWorkMode: 'Flexible',
              experienceLevel: 'Entry-Level / Student',
              bio: `Ambitious ${educationLevel} student passionate about ${targetRole || 'career growth'}.`
            }
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail: string) => {
    onSwitchDemoUser(demoEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#161618] rounded-2xl max-w-md w-full shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#111112] via-[#161618] to-[#111112] p-6 text-white relative border-b border-white/10">
          <button
            id="auth-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Student Career Portal</span>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            {mode === 'login' && 'Welcome Back, Student'}
            {mode === 'register' && 'Create Your Career Profile'}
            {mode === 'demo' && 'Select Demo Student Account'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Unlock tailored AI career roadmaps, skill diagnostics, and industry insights.
          </p>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-black/40 border border-white/5 p-1 rounded-xl mt-4 text-xs font-semibold">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`py-1.5 rounded-lg transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`py-1.5 rounded-lg transition-all ${mode === 'register' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              Register
            </button>
            <button
              onClick={() => { setMode('demo'); setErrorMsg(''); }}
              className={`py-1.5 rounded-lg transition-all ${mode === 'demo' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'}`}
            >
              1-Click Demo
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium">
                Select a ready-to-test student profile to test the application instantly:
              </p>

              {/* Demo Account 1 */}
              <button
                onClick={() => handleDemoSelect('alex.chen@university.edu')}
                className="w-full text-left p-3 rounded-xl border border-white/5 bg-[#111112] hover:border-white/15 hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    AC
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Alex Chen</h4>
                    <p className="text-[11px] text-gray-400">CS & AI Undergraduate</p>
                    <span className="inline-block mt-0.5 text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      Goal: ML Engineer
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>

              {/* Demo Account 2 */}
              <button
                onClick={() => handleDemoSelect('maya.patel@designhub.org')}
                className="w-full text-left p-3 rounded-xl border border-white/5 bg-[#111112] hover:border-white/15 hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-sm">
                    MP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Maya Patel</h4>
                    <p className="text-[11px] text-gray-400">HCI & Product Design Senior</p>
                    <span className="inline-block mt-0.5 text-[10px] bg-purple-950/60 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                      Goal: Product Designer (UI/UX)
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>

              {/* Demo Account 3 */}
              <button
                onClick={() => handleDemoSelect('jordan.taylor@biztech.edu')}
                className="w-full text-left p-3 rounded-xl border border-white/5 bg-[#111112] hover:border-white/15 hover:bg-white/5 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 flex items-center justify-center font-bold text-sm">
                    JT
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Jordan Taylor</h4>
                    <p className="text-[11px] text-gray-400">Business / Career Switcher</p>
                    <span className="inline-block mt-0.5 text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                      Goal: Data Science & Analytics
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Samantha Lee"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Education Level</label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value as any)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Bootcamp / Self-Taught">Bootcamp</option>
                        <option value="Career Switcher">Career Switcher</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Major / Field</label>
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Target Dream Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Machine Learning Engineer or Product Manager"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#111112] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Free Student Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <div className="mt-4 pt-3 border-t border-white/5 text-center">
              <p className="text-xs text-gray-400">
                Want to test without registering?{' '}
                <button
                  type="button"
                  onClick={() => setMode('demo')}
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Use 1-Click Demo
                </button>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
