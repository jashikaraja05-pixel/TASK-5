export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  token?: string;
  profile: StudentProfile;
  createdAt: string;
}

export interface StudentProfile {
  educationLevel: 'High School' | 'Undergraduate' | 'Graduate' | 'Bootcamp / Self-Taught' | 'Career Switcher';
  major: string;
  institution?: string;
  graduationYear?: string;
  interests: string[];
  currentSkills: string[];
  targetRole: string;
  targetIndustry: string;
  preferredWorkMode: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  targetLocation?: string;
  experienceLevel: 'Entry-Level / Student' | 'Junior (0-2 yrs)' | 'Mid-Level (3-5 yrs)' | 'Exploring';
  bio?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedFollowups?: string[];
  category?: 'general' | 'roadmap' | 'skill_gap' | 'salary' | 'resume' | 'interview';
  isBookmarked?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  milestones: {
    id: string;
    title: string;
    description: string;
    resources?: string[];
    completed?: boolean;
  }[];
}

export interface CareerRoadmap {
  roleTitle: string;
  industry: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTimeline: string;
  summary: string;
  phases: RoadmapPhase[];
  keyCertifications: string[];
  recommendedProjects: {
    title: string;
    difficulty: string;
    description: string;
    techStack: string[];
  }[];
}

export interface SkillGapAnalysis {
  targetRole: string;
  matchScore: number; // 0-100
  matchingSkills: string[];
  missingCriticalSkills: string[];
  niceToHaveSkills: string[];
  learningPlan: {
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    estimatedHours: number;
    recommendedResources: {
      name: string;
      platform: string;
      url?: string;
      type: 'Course' | 'Certification' | 'Documentation' | 'Book' | 'Practice';
    }[];
  }[];
  portfolioAdvice: string[];
}

export interface IndustryInsight {
  id: string;
  name: string;
  category: string;
  growthRate: string;
  demandLevel: 'Very High' | 'High' | 'Moderate' | 'Growing Rapidly';
  averageStartingSalary: string;
  averageSeniorSalary: string;
  topRoles: string[];
  emergingSkills: string[];
  hiringHubs: string[];
  marketOverview: string;
  futureOutlook: string;
}

export interface ResumeReviewResult {
  overallScore: number; // 0-100
  atsReadabilityScore: number;
  impactScore: number;
  summaryFeedback: string;
  strengths: string[];
  weaknesses: string[];
  bulletImprovements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  missingKeywords: string[];
  suggestedActionItems: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    label: string;
    scoreTrait: 'analytical' | 'creative' | 'technical' | 'social' | 'enterprising' | 'investigative';
    weight: number;
  }[];
}

export interface QuizResult {
  dominantTraits: { trait: string; percentage: number }[];
  recommendedCareers: {
    title: string;
    industry: string;
    matchScore: number;
    description: string;
    averageSalary: string;
    entryRequirements: string;
  }[];
  summary: string;
}
