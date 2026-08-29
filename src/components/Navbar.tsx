import React from 'react';
import { 
  Compass, 
  MessageSquare, 
  Map, 
  Target, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Download,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onSwitchDemoUser: (email: string) => void;
  onOpenExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onSwitchDemoUser,
  onOpenExport
}) => {
  const [showDemoMenu, setShowDemoMenu] = React.useState(false);
  const demoRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemoMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'chat', label: 'AI Advisor', icon: MessageSquare },
    { id: 'roadmap', label: 'Career Roadmaps', icon: Map },
    { id: 'skill-gap', label: 'Skill Gap', icon: Target },
    { id: 'industries', label: 'Industry Insights', icon: TrendingUp },
    { id: 'resume', label: 'Resume Review', icon: FileText },
    { id: 'quiz', label: 'Career Quiz', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#111112]/95 backdrop-blur border-b border-white/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif italic text-lg text-white tracking-wide">
                  Lumina Career AI
                </span>
                <span className="bg-indigo-950/60 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                Personalized Career Pathways & Market Insights
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#161618] p-1 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#222226] text-white shadow-xs border border-white/10 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Export Summary Button */}
            <button
              id="export-report-btn"
              onClick={onOpenExport}
              title="Export Career Planning Report"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-[#161618] hover:bg-[#1e1e22] hover:text-white rounded-lg transition-colors border border-white/10"
            >
              <Download className="w-3.5 h-3.5 text-gray-400" />
              <span>Export</span>
            </button>

            {/* Demo User Switcher Dropdown */}
            <div className="relative" ref={demoRef}>
              <button
                id="demo-switcher-btn"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 rounded-lg transition-colors"
                title="Switch student profile demo"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#161618] rounded-xl shadow-2xl border border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-white/5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                      Demo Student Profiles
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSwitchDemoUser('alex.chen@university.edu');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center space-x-2.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-200">Alex Chen (CS & AI)</p>
                      <p className="text-[11px] text-gray-400">Target: ML Engineer</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchDemoUser('maya.patel@designhub.org');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center space-x-2.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-200">Maya Patel (HCI / Design)</p>
                      <p className="text-[11px] text-gray-400">Target: Product Designer</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onSwitchDemoUser('jordan.taylor@biztech.edu');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center space-x-2.5 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-200">Jordan Taylor (Biz / Quant)</p>
                      <p className="text-[11px] text-gray-400">Target: Data Scientist</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated Profile or Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  id="profile-trigger-btn"
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#161618] hover:bg-[#1f1f23] rounded-xl transition-all border border-white/10"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-400/50"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-none truncate max-w-[100px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-indigo-400 font-medium truncate max-w-[100px] mt-0.5">
                      {currentUser.profile.targetRole || currentUser.profile.major}
                    </p>
                  </div>
                </button>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors uppercase tracking-wider"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-white/5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#161618] text-gray-400 border border-white/5'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
