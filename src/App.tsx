import React, { useState, useEffect } from 'react';
import { User, StudentProfile } from './types';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { ChatView } from './components/ChatView';
import { RoadmapView } from './components/RoadmapView';
import { SkillGapView } from './components/SkillGapView';
import { IndustryInsightsView } from './components/IndustryInsightsView';
import { ResumeReviewView } from './components/ResumeReviewView';
import { AssessmentQuizView } from './components/AssessmentQuizView';

const DEFAULT_DEMO_USER: User = {
  id: 'user_alex',
  email: 'alex.chen@university.edu',
  name: 'Alex Chen',
  createdAt: '2025-01-10T00:00:00.000Z',
  profile: {
    educationLevel: 'Undergraduate',
    major: 'Computer Science & AI',
    institution: 'State University',
    graduationYear: '2026',
    interests: ['Machine Learning', 'Full-Stack Systems', 'Cloud Infrastructure', 'Robotics'],
    currentSkills: ['Python', 'PyTorch', 'TypeScript', 'React', 'SQL', 'Git', 'Data Structures'],
    targetRole: 'Machine Learning Engineer',
    targetIndustry: 'Artificial Intelligence & Robotics',
    targetLocation: 'San Francisco, CA / Remote',
    preferredWorkMode: 'Hybrid',
    experienceLevel: 'Entry-Level / Student',
    bio: 'Junior CS student passionate about building scalable deep learning systems and AI applications.'
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('career_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_DEMO_USER;
  });

  const [activeTab, setActiveTab] = useState<string>('chat');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('career_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('career_current_user');
    showToast('Signed out of session.');
  };

  const handleSwitchDemoUser = async (email: string) => {
    try {
      const res = await fetch(`/api/auth/demo-user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        showToast(`Switched profile to ${data.user.name}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (updatedProfile: StudentProfile, updatedName: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          profile: updatedProfile
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');
      
      setCurrentUser({
        ...currentUser,
        name: updatedName,
        profile: updatedProfile
      });
      showToast('Career profile updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save changes.');
    }
  };

  const handleAddSkillToProfile = async (newSkill: string) => {
    if (!currentUser) return;
    if (currentUser.profile.currentSkills.includes(newSkill)) return;

    const updatedSkills = [...currentUser.profile.currentSkills, newSkill];
    const updatedProfile = { ...currentUser.profile, currentSkills: updatedSkills };
    
    await handleUpdateProfile(updatedProfile, currentUser.name);
    showToast(`Added "${newSkill}" to your verified skills!`);
  };

  const handleSetTargetRoleFromQuiz = async (newRole: string, newIndustry: string) => {
    if (!currentUser) return;
    const updatedProfile: StudentProfile = {
      ...currentUser.profile,
      targetRole: newRole,
      targetIndustry: newIndustry
    };
    await handleUpdateProfile(updatedProfile, currentUser.name);
    showToast(`Target role set to "${newRole}"!`);
    setActiveTab('roadmap');
  };

  const handleAskAI = (promptText: string) => {
    setActiveTab('chat');
    // Allow React to mount ChatView, then dispatch chat input event
    setTimeout(() => {
      const chatInput = document.getElementById('career-chat-input') as HTMLTextAreaElement | null;
      const sendBtn = document.getElementById('career-chat-send-btn') as HTMLButtonElement | null;
      if (chatInput) {
        chatInput.value = promptText;
        chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        if (sendBtn) {
          sendBtn.click();
        }
      }
    }, 150);
  };

  const handleExportReport = () => {
    if (!currentUser) {
      showToast('Please sign in or select a demo user first.');
      return;
    }
    const reportContent = `# Student Career Guidance Action Plan
Generated: ${new Date().toLocaleDateString()}
Student: ${currentUser.name} (${currentUser.email})
Education: ${currentUser.profile.educationLevel} in ${currentUser.profile.major}
Target Career Goal: ${currentUser.profile.targetRole}
Target Industry: ${currentUser.profile.targetIndustry}

## 1. Verified Technical & Core Skills
${currentUser.profile.currentSkills.map(s => `- ${s}`).join('\n')}

## 2. Target Passions & Sub-Domains
${currentUser.profile.interests.map(i => `- ${i}`).join('\n')}

## 3. Recommended 6-Month Action Steps
1. Master core fundamentals for ${currentUser.profile.targetRole}.
2. Complete at least 2 portfolio-grade capstone projects demonstrating impact.
3. Optimize resume with quantifiable Google X-Y-Z formula metrics.
4. Prepare for behavioral and technical interviews via the AI Advisor.

---
Career Guidance Assistant — Powered by Google Gemini AI
`;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser.name.replace(/\s+/g, '_')}_Career_Action_Plan.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Career Action Plan exported!');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col font-sans text-gray-300 antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 right-6 z-50 bg-[#161618] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
        onSwitchDemoUser={handleSwitchDemoUser}
        onOpenExport={handleExportReport}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatView
            currentUser={currentUser}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            currentUser={currentUser}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'skill-gap' && (
          <SkillGapView
            currentUser={currentUser}
            onAskAI={handleAskAI}
            onAddSkillToProfile={handleAddSkillToProfile}
          />
        )}

        {(activeTab === 'industries' || activeTab === 'insights') && (
          <IndustryInsightsView
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeReviewView
            currentUser={currentUser}
            onAskAI={handleAskAI}
          />
        )}

        {activeTab === 'quiz' && (
          <AssessmentQuizView
            currentUser={currentUser}
            onSetTargetRole={handleSetTargetRoleFromQuiz}
            onAskAI={handleAskAI}
          />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchDemoUser={handleSwitchDemoUser}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />

    </div>
  );
}
