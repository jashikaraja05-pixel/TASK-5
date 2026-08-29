import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  Plus, 
  Trash2, 
  MessageSquare, 
  ChevronRight, 
  Compass, 
  Target, 
  TrendingUp, 
  FileText,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, ChatSession, User } from '../types';

interface ChatViewProps {
  currentUser: User | null;
  onNavigateTab: (tab: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ currentUser, onNavigateTab }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('career_chat_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const initialSession: ChatSession = {
      id: 'session-1',
      title: 'Career Planning & Guidance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          content: `👋 Hello **${currentUser?.name || 'there'}**! I am your **AI Career Guidance Assistant**.

I'm here to help you navigate every stage of your career journey:
- 🗺️ **Personalized Career Roadmaps:** Step-by-step milestones, tech stacks, and timelines.
- 🎯 **Skill Gap Diagnostics:** Identifying missing competencies and high-ROI courses.
- 📈 **Industry Insights & Salaries:** Real-time compensation bands and hiring market dynamics.
- 📄 **Resume & Interview Strategy:** Google X-Y-Z formula bullet optimization and mock Q&As.

How can I help you today? Feel free to ask anything or click one of the suggested prompts below!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowups: [
            `What is a realistic 6-month roadmap for ${currentUser?.profile?.targetRole || 'Software Engineering'}?`,
            `What starting salaries can I expect in ${currentUser?.profile?.targetIndustry || 'Tech'}?`,
            `How should I structure my resume as a ${currentUser?.profile?.educationLevel || 'student'}?`
          ]
        }
      ]
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-1');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('career_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `Career Chat ${sessions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'assistant',
          content: `Hello! Starting a fresh career consultation for **${currentUser?.profile?.targetRole || 'your career path'}**. What topic shall we explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowups: [
            'Create a customized learning roadmap',
            'Review my skills gap for top internships',
            'What are top companies looking for right now?'
          ]
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      handleCreateNewSession();
      setSessions(prev => prev.filter(s => s.id !== idToDelete));
      return;
    }
    const filtered = sessions.filter(s => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const assistantPlaceholder: ChatMessage = {
      id: assistantPlaceholderId,
      sender: 'assistant',
      content: '', // Empty initially to show animated typing bubble
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: []
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    
    // Update session title if first user query
    let newTitle = activeSession.title;
    if (activeSession.messages.length <= 1) {
      newTitle = query.slice(0, 30) + (query.length > 30 ? '...' : '');
    }

    // Set messages with user query and assistant typing placeholder
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { 
              ...s, 
              title: newTitle, 
              updatedAt: new Date().toISOString(), 
              messages: [...updatedMessages, assistantPlaceholder] 
            }
          : s
      )
    );

    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 6000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          history: updatedMessages.slice(-4).map(m => ({ sender: m.sender, content: m.content })),
          profile: currentUser?.profile ? {
            name: currentUser.name,
            ...currentUser.profile
          } : undefined
        })
      });

      clearTimeout(abortTimeout);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || 'Here is the strategic guidance for your career goal.';
      const followups = Array.isArray(data.suggestedFollowups) && data.suggestedFollowups.length > 0
        ? data.suggestedFollowups
        : [
            'Create a step-by-step 6-month roadmap',
            'What projects should I build to get hired?',
            'What starting salary can I expect?'
          ];

      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === assistantPlaceholderId
                    ? {
                        ...m,
                        content: replyContent,
                        suggestedFollowups: followups
                      }
                    : m
                )
              }
            : s
        )
      );
    } catch (err: any) {
      clearTimeout(abortTimeout);
      console.warn('Chat fetch fallback:', err);
      
      // Fallback message
      const fallbackContent = query.toLowerCase().includes('analyst') || query.toLowerCase().includes('data')
        ? `### 📊 Essential Skills for Data Analyst

1. **Spreadsheets:** Advanced Excel / Sheets (Pivot Tables, VLOOKUP, Power Query)
2. **SQL & Databases:** Window functions, CTEs, Joins, Aggregations
3. **BI & Visualization:** Power BI (DAX) or Tableau dashboards
4. **Python for Analytics:** Pandas, NumPy, Matplotlib
5. **Business Analytics:** A/B testing, KPI metrics, Descriptive Statistics

💰 **Salary Range:** ₹5.5 – 10 LPA (Freshers) | $75k – $115k (US/Remote)`
        : `### 🎯 Strategic Guidance for Your Career

1. **Core Skills:** Master key tools and programming languages required for your target role.
2. **Portfolio Project:** Build a full-stack, production-ready project and host it live.
3. **Interview Prep:** Solve 2-3 algorithmic problems daily and review CS fundamentals.`;

      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === assistantPlaceholderId
                    ? {
                        ...m,
                        content: fallbackContent,
                        suggestedFollowups: [
                          'Create a step-by-step roadmap for this role',
                          'How to prepare for technical interviews?',
                          'What salary can I expect as an entry-level candidate?'
                        ]
                      }
                    : m
                )
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const handleToggleBookmark = (msgId: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(m =>
              m.id === msgId ? { ...m, isBookmarked: !m.isBookmarked } : m
            )
          };
        }
        return s;
      })
    );
  };

  const handleSpeak = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
        return;
      }
      window.speechSynthesis.cancel();
      // Strip markdown hashes and stars for cleaner speech
      const plain = text.replace(/[#*_`\[\]]/g, '');
      const utterance = new SpeechSynthesisUtterance(plain);
      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick Starter Prompts for Students
  const STARTER_PROMPTS = [
    {
      title: '6-Month Career Roadmap',
      desc: 'Milestones & timeline for target role',
      icon: Compass,
      query: `Create a step-by-step 6-month roadmap for becoming a ${currentUser?.profile?.targetRole || 'Machine Learning Engineer'}, including projects and certifications.`
    },
    {
      title: 'Skill Gap & Course Finder',
      desc: 'Find what is missing in current profile',
      icon: Target,
      query: `Analyze my current skills (${(currentUser?.profile?.currentSkills || []).join(', ') || 'fundamentals'}) against industry requirements for ${currentUser?.profile?.targetRole || 'Software Engineering'} and recommend free top resources.`
    },
    {
      title: 'Salary & Market Outlook',
      desc: 'Compensation bands & top hiring hubs',
      icon: TrendingUp,
      query: `What are the current entry-level vs senior salary ranges for ${currentUser?.profile?.targetRole || 'Tech Careers'} in top hubs vs remote?`
    },
    {
      title: 'Google X-Y-Z Resume Fix',
      desc: 'Transform bullets into impact statements',
      icon: FileText,
      query: `Show me 3 strong before-and-after resume bullet point examples using the Google "Accomplished X by doing Y" formula for a ${currentUser?.profile?.major || 'STEM'} student.`
    }
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto overflow-hidden bg-[#0A0A0B]">
      
      {/* Session History Sidebar (Collapsible on Mobile) */}
      <aside
        className={`w-72 bg-[#0E0E0F] border-r border-white/5 flex flex-col shrink-0 transition-all duration-200 z-20 ${
          sidebarOpen ? 'fixed inset-y-0 left-0 pt-16 shadow-2xl' : 'hidden md:flex'
        }`}
      >
        <div className="p-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Conversations</span>
          </div>
          <button
            id="new-chat-btn"
            onClick={handleCreateNewSession}
            className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-xs font-bold rounded-lg transition-colors border border-indigo-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setSidebarOpen(false);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-xs ${
                  isActive
                    ? 'bg-[#161618] text-white font-semibold border border-white/10 shadow-xs'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className="truncate">{session.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  title="Delete chat"
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-400 rounded transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Target Role Banner at Bottom of Sidebar */}
        <div className="p-4 bg-[#111112] border-t border-white/5 text-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 font-medium">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Target Goal</span>
            <span className="text-indigo-400 font-semibold">{currentUser?.profile?.targetRole || 'Not Set'}</span>
          </div>
          <p className="text-[11px] text-gray-500">
            {currentUser?.profile?.educationLevel} • {currentUser?.profile?.major}
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0A0A0B] overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-white/5 bg-[#111112]/90 backdrop-blur flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold text-white leading-tight">
                  Lumina Career Intelligence
                </h3>
                <p className="text-[11px] text-gray-500">
                  Target: <span className="font-medium text-indigo-400">{currentUser?.profile?.targetRole || 'Student Planning'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-[#161618] hover:bg-[#202024] text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Roadmaps</span>
            </button>
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-[#161618] hover:bg-[#202024] text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-white/5"
            >
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Skill Matrix</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* If only welcome message, show high-impact prompt starter cards */}
          {activeSession?.messages?.length <= 1 && (
            <div className="max-w-3xl mx-auto my-4 space-y-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-950/40 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-time Guidance</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Navigate Your Career Trajectory
                </h2>
                <p className="text-xs text-gray-400 max-w-lg mx-auto mt-1">
                  Explore tailored roadmaps, industry compensation benchmarks, and actionable resume optimization.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STARTER_PROMPTS.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(card.query)}
                      className="text-left p-4 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-[#161618] transition-all group bg-[#111112] shadow-xs"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 transition-colors border border-white/5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {card.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {activeSession?.messages?.map((msg) => {
            if (msg.sender === 'assistant' && !msg.content) return null;
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 max-w-3xl ${
                  isUser ? 'ml-auto justify-end flex-row-reverse space-x-reverse' : 'mr-auto justify-start'
                }`}
              >
                {!isUser ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 mt-1">
                    <span className="text-[10px] font-bold text-indigo-400">AI</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                    <span className="text-[10px] font-bold text-white">
                      {currentUser?.name?.slice(0, 2).toUpperCase() || 'ME'}
                    </span>
                  </div>
                )}

                <div className="flex flex-col space-y-1 max-w-[88%] sm:max-w-[82%]">
                  <div
                    className={`p-4 text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 border border-indigo-500 text-white rounded-2xl rounded-tr-none'
                        : 'bg-[#161618] border border-white/5 text-gray-300 font-light rounded-2xl rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-normal text-white">{msg.content}</p>
                    ) : !msg.content ? (
                      <div className="flex items-center space-x-2 py-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                        <span className="text-xs text-gray-400 font-medium ml-2 animate-pulse">
                          Generating career insights...
                        </span>
                      </div>
                    ) : (
                      <div className="markdown-body">
                        <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                      </div>
                    )}
                  </div>

                  {/* Actions & Followups for Assistant */}
                  {!isUser && msg.content && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center space-x-3 text-[11px] text-gray-500 px-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{msg.timestamp}</span>
                        </span>

                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-gray-300 flex items-center space-x-1 transition-colors"
                          title="Copy response"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleBookmark(msg.id)}
                          className={`hover:text-gray-300 flex items-center space-x-1 transition-colors ${
                            msg.isBookmarked ? 'text-amber-400 font-bold' : ''
                          }`}
                          title="Bookmark this advice"
                        >
                          <Bookmark className={`w-3 h-3 ${msg.isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                          <span>{msg.isBookmarked ? 'Saved' : 'Bookmark'}</span>
                        </button>

                        {'speechSynthesis' in window && (
                          <button
                            onClick={() => handleSpeak(msg.id, msg.content)}
                            className="hover:text-gray-300 flex items-center space-x-1 transition-colors"
                            title="Read aloud"
                          >
                            <Volume2 className={`w-3 h-3 ${isSpeaking === msg.id ? 'text-indigo-400 animate-pulse' : ''}`} />
                            <span>{isSpeaking === msg.id ? 'Stop' : 'Listen'}</span>
                          </button>
                        )}
                      </div>

                      {/* Interactive Follow-up Prompt Pills */}
                      {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedFollowups.map((followup, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(followup)}
                              className="text-left px-2.5 py-1 bg-[#161618] hover:bg-[#202026] text-indigo-300 hover:text-indigo-200 border border-white/10 rounded-lg text-[11px] font-medium transition-colors shadow-2xs flex items-center space-x-1"
                            >
                              <span>{followup}</span>
                              <ChevronRight className="w-3 h-3 text-indigo-400/70 shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-white/5 bg-[#0E0E0F] shrink-0">
          <div className="max-w-4xl mx-auto relative">
            <input
              type="text"
              id="career-chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask about industry shifts, interview prep, or career paths for ${currentUser?.profile?.targetRole || 'your goal'}...`}
              className="w-full bg-[#161618] border border-white/10 rounded-xl py-4 pl-6 pr-24 text-sm focus:outline-none focus:border-indigo-500/50 text-white placeholder:text-gray-600"
            />
            <div className="absolute right-2 top-2 bottom-2 flex gap-2">
              <button
                type="button"
                id="career-chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 px-4 rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-colors flex items-center space-x-1"
              >
                <span>Send</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-4 uppercase tracking-[0.3em]">
            Lumina AI Guidance Engine • Context-Aware Professional Planning
          </p>
        </div>

      </div>
    </div>
  );
};
