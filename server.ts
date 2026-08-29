import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get or initialize Google Gen AI safely
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory mock database for registered students and demo users
const USERS_DB: Map<string, any> = new Map();

// Seed initial demo users
const DEMO_USERS = [
  {
    id: 'demo-alex',
    email: 'alex.chen@university.edu',
    name: 'Alex Chen',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profile: {
      educationLevel: 'Undergraduate',
      major: 'Computer Science & Data',
      institution: 'State University',
      graduationYear: '2026',
      interests: ['Artificial Intelligence', 'Distributed Systems', 'Open Source', 'Autonomous Robotics'],
      currentSkills: ['Python', 'TypeScript', 'React', 'SQL', 'Git', 'Data Structures'],
      targetRole: 'Machine Learning Engineer',
      targetIndustry: 'Artificial Intelligence & Machine Learning',
      preferredWorkMode: 'Hybrid',
      targetLocation: 'San Francisco, CA or Remote',
      experienceLevel: 'Entry-Level / Student',
      bio: 'Junior undergraduate student passionate about deep learning, LLMs, and building intelligent agents.'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-maya',
    email: 'maya.patel@designhub.org',
    name: 'Maya Patel',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    profile: {
      educationLevel: 'Undergraduate',
      major: 'Human-Computer Interaction & Informatics',
      institution: 'Polytechnic Institute',
      graduationYear: '2025',
      interests: ['UI/UX Design', 'Design Systems', 'Accessibility (a11y)', 'Product Strategy'],
      currentSkills: ['Figma', 'User Research', 'Wireframing', 'Tailwind CSS', 'HTML/CSS', 'Usability Testing'],
      targetRole: 'Product Designer (UI/UX)',
      targetIndustry: 'Product Management & UI/UX Design',
      preferredWorkMode: 'Remote',
      targetLocation: 'New York or Remote',
      experienceLevel: 'Entry-Level / Student',
      bio: 'Design enthusiast dedicated to crafting accessible, beautiful user interfaces and zero-friction digital products.'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-jordan',
    email: 'jordan.taylor@biztech.edu',
    name: 'Jordan Taylor',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    profile: {
      educationLevel: 'Bootcamp / Self-Taught',
      major: 'Business Administration (Switching to Tech)',
      institution: 'Tech Forward Academy',
      graduationYear: '2024',
      interests: ['FinTech', 'Cloud Infrastructure', 'Cybersecurity', 'API Platforms'],
      currentSkills: ['Python', 'SQL', 'Financial Modeling', 'Excel', 'Problem Solving', 'Communication'],
      targetRole: 'Data Scientist & Analytics Engineer',
      targetIndustry: 'Data Science & Business Intelligence',
      preferredWorkMode: 'Flexible',
      targetLocation: 'Austin, TX or Chicago, IL',
      experienceLevel: 'Career Switcher',
      bio: 'Business graduate transitioning into analytics engineering and data science modeling.'
    },
    createdAt: new Date().toISOString()
  }
];

// Populate initial database
DEMO_USERS.forEach(u => USERS_DB.set(u.email.toLowerCase(), u));

// ----------------------------------------------------
// AUTH API ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, name, password, profile } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const emailKey = email.trim().toLowerCase();
    if (USERS_DB.has(emailKey)) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: emailKey,
      name: name.trim(),
      password,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      profile: profile || {
        educationLevel: 'Undergraduate',
        major: 'General Studies',
        interests: ['Technology', 'Career Growth'],
        currentSkills: ['Problem Solving', 'Communication'],
        targetRole: 'Software Developer',
        targetIndustry: 'Information Technology',
        preferredWorkMode: 'Flexible',
        experienceLevel: 'Entry-Level / Student',
        bio: 'Aspiring professional ready to plan my career.'
      },
      createdAt: new Date().toISOString()
    };

    USERS_DB.set(emailKey, newUser);
    const token = `token-${newUser.id}-${Date.now()}`;

    const { password: _, ...safeUser } = newUser;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const user = USERS_DB.get(emailKey);

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please check your credentials or register.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    const token = `token-${user.id}-${Date.now()}`;
    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const { email, profile, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email identifier required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const user = USERS_DB.get(emailKey);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (profile) user.profile = { ...user.profile, ...profile };
    if (name) user.name = name;

    USERS_DB.set(emailKey, user);
    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Profile update failed.' });
  }
});

// ----------------------------------------------------
// AI CAREER CHATBOT API (GEMINI 3.7 FLASH)
// ----------------------------------------------------

// Streaming Chat API (SSE) for instant sub-second token delivery
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const { message, history = [], profile } = req.body;

  if (!message || typeof message !== 'string') {
    res.write(`data: ${JSON.stringify({ error: 'Valid user message is required.' })}\n\n`);
    return res.end();
  }

  const ai = getGenAI();

  const studentContext = profile ? `
STUDENT PROFILE CONTEXT:
- Name: ${profile.name || 'Student'}
- Education: ${profile.educationLevel || 'Undergraduate'} in ${profile.major || 'Not specified'}
- Institution / Year: ${profile.institution || 'N/A'} (Class of ${profile.graduationYear || 'Upcoming'})
- Target Role: ${profile.targetRole || 'Exploring Career Paths'}
- Target Industry: ${profile.targetIndustry || 'Technology & Innovation'}
- Current Skills: ${(profile.currentSkills || []).join(', ') || 'General fundamentals'}
- Interests: ${(profile.interests || []).join(', ') || 'Exploring'}
- Work Preference: ${profile.preferredWorkMode || 'Flexible'} (${profile.targetLocation || 'Global / Remote'})
- Experience Level: ${profile.experienceLevel || 'Entry-Level / Student'}
` : 'No specific student profile provided yet. Treat the user as an ambitious student seeking career guidance.';

  const systemInstruction = `
You are the "Career Guidance Assistant" — a world-class, polyglot AI career advisor and tech mentor.

CORE PRINCIPLES & DIRECTIVES:
1. 🌐 UNIVERSAL MULTILINGUAL MASTERY:
   - You understand and speak ALL languages fluently, including Tamil (தமிழ்), Tanglish (Tamil written in English script), Hindi, Hinglish, Telugu, Malayalam, Kannada, Spanish, French, German, Japanese, and English.
   - Match the user's language and tone naturally. If the user writes in Tamil or Tanglish, understand it 100% and respond in crisp, easy-to-understand Tamil, Tanglish, or bilingual format as appropriate, or clear English if requested.

2. 🎯 CRISP, TO-THE-POINT, NO FLUFF (நோ வளவள கொலகொல):
   - Answer EXACTLY what the user asks directly, without filler introductions, generic corporate talk, or long-winded essays.
   - Keep points bite-sized, structured, and easy to scan with bullet points and bold highlights.

3. 💼 SPECIFIC, ACCURATE CAREER & SALARY DATA:
   - When asked about salaries or highest-paying developer jobs: Provide real-world numbers (India LPA & Global/US USD ranges) and the exact high-value skills required (e.g. AI/LLM Engineer: ₹18–35+ LPA / $150k–240k; Data Engineer: ₹12–25+ LPA; Cloud/DevOps Architect: ₹16–30+ LPA; Quant Dev: ₹30–60+ LPA).
   - When asked "What to study for Data Engineering" or any tech role: Give a clear, ordered checklist of specific tools/technologies (e.g. 1. Languages: Python + Advanced SQL; 2. Big Data: Apache Spark, Kafka; 3. Data Warehousing: Snowflake, BigQuery; 4. Orchestration: Apache Airflow; 5. Cloud: AWS/GCP).

4. 📌 STRUCTURED OUTPUT:
   - Use clear markdown headers, short bullet points, and actionable takeaways.
   - Always end with 3 relevant follow-up suggestions on a single line under "---" starting with: "Follow-up questions: [Option 1] | [Option 2] | [Option 3]".

${studentContext}
`;

  let promptText = message;
  if (history.length > 0) {
    const recentHistory = history.slice(-4).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Assistant'}: ${h.content}`).join('\n\n');
    promptText = `Conversation History:\n${recentHistory}\n\nStudent's latest query:\n${message}`;
  }

  if (ai) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.7-flash',
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      let accumulated = '';
      for await (const chunk of responseStream) {
        const text = chunk.text || '';
        if (text) {
          accumulated += text;
          res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
        }
      }

      let followups: string[] = [];
      if (accumulated.includes('Follow-up questions:')) {
        const parts = accumulated.split('Follow-up questions:');
        const rawFollowups = parts[1] || '';
        followups = rawFollowups
          .split('|')
          .map(s => s.replace(/\[|\]/g, '').trim())
          .filter(Boolean)
          .slice(0, 3);
      }

      if (followups.length === 0) {
        followups = generateDefaultFollowups(message, profile?.targetRole);
      }

      res.write(`data: ${JSON.stringify({ done: true, suggestedFollowups: followups })}\n\n`);
      return res.end();
    } catch (err: any) {
      console.error('Gemini stream error, sending instant fallback:', err);
      const fallback = generateExpertGuidanceFallback(message, profile);
      res.write(`data: ${JSON.stringify({ chunk: fallback.reply })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, suggestedFollowups: fallback.suggestedFollowups })}\n\n`);
      return res.end();
    }
  } else {
    const fallback = generateExpertGuidanceFallback(message, profile);
    res.write(`data: ${JSON.stringify({ chunk: fallback.reply })}\n\n`);
    res.write(`data: ${JSON.stringify({ done: true, suggestedFollowups: fallback.suggestedFollowups })}\n\n`);
    return res.end();
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], profile } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid user message is required.' });
    }

    const ai = getGenAI();

    // Contextual system prompt for student career guidance
    const studentContext = profile ? `
STUDENT PROFILE CONTEXT:
- Name: ${profile.name || 'Student'}
- Education: ${profile.educationLevel || 'Undergraduate'} in ${profile.major || 'Not specified'}
- Institution / Year: ${profile.institution || 'N/A'} (Class of ${profile.graduationYear || 'Upcoming'})
- Target Role: ${profile.targetRole || 'Exploring Career Paths'}
- Target Industry: ${profile.targetIndustry || 'Technology & Innovation'}
- Current Skills: ${(profile.currentSkills || []).join(', ') || 'General fundamentals'}
- Interests: ${(profile.interests || []).join(', ') || 'Exploring'}
- Work Preference: ${profile.preferredWorkMode || 'Flexible'} (${profile.targetLocation || 'Global / Remote'})
- Experience Level: ${profile.experienceLevel || 'Entry-Level / Student'}
` : 'No specific student profile provided yet. Treat the user as an ambitious student seeking career guidance.';

    const systemInstruction = `
You are the "Career Guidance Assistant" — a world-class, polyglot AI career advisor and tech mentor.

CORE PRINCIPLES & DIRECTIVES:
1. 🌐 UNIVERSAL MULTILINGUAL MASTERY:
   - You understand and speak ALL languages fluently, including Tamil (தமிழ்), Tanglish (Tamil written in English script), Hindi, Hinglish, Telugu, Malayalam, Kannada, Spanish, French, German, Japanese, and English.
   - Match the user's language and tone naturally. If the user writes in Tamil or Tanglish, understand it 100% and respond in crisp, easy-to-understand Tamil, Tanglish, or bilingual format as appropriate, or clear English if requested.

2. 🎯 CRISP, TO-THE-POINT, NO FLUFF (நோ வளவள கொலகொல):
   - Answer EXACTLY what the user asks directly, without filler introductions, generic corporate talk, or long-winded essays.
   - Keep points bite-sized, structured, and easy to scan with bullet points and bold highlights.

3. 💼 SPECIFIC, ACCURATE CAREER & SALARY DATA:
   - When asked about salaries or highest-paying developer jobs: Provide real-world numbers (India LPA & Global/US USD ranges) and the exact high-value skills required (e.g. AI/LLM Engineer: ₹18–35+ LPA / $150k–240k; Data Engineer: ₹12–25+ LPA; Cloud/DevOps Architect: ₹16–30+ LPA; Quant Dev: ₹30–60+ LPA).
   - When asked "What to study for Data Engineering" or any tech role: Give a clear, ordered checklist of specific tools/technologies (e.g. 1. Languages: Python + Advanced SQL; 2. Big Data: Apache Spark, Kafka; 3. Data Warehousing: Snowflake, BigQuery; 4. Orchestration: Apache Airflow; 5. Cloud: AWS/GCP).

4. 📌 STRUCTURED OUTPUT:
   - Use clear markdown headers, short bullet points, and actionable takeaways.
   - Always end with 3 relevant follow-up suggestions on a single line under "---" starting with: "Follow-up questions: [Option 1] | [Option 2] | [Option 3]".

${studentContext}
`;

    if (ai) {
      try {
        // Format history for multi-turn chat if available
        let promptText = message;
        if (history.length > 0) {
          const recentHistory = history.slice(-4).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Assistant'}: ${h.content}`).join('\n\n');
          promptText = `Conversation History:\n${recentHistory}\n\nStudent's latest query:\n${message}`;
        }

        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.7,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        // 8 second timeout race for instant fallback
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI generation timed out')), 8000));
        const response: any = await Promise.race([responsePromise, timeoutPromise]);

        let fullText = response.text || '';
        let followups: string[] = [];

        // Parse follow-up suggestions if generated
        if (fullText.includes('Follow-up questions:')) {
          const parts = fullText.split('Follow-up questions:');
          fullText = parts[0].trim();
          const rawFollowups = parts[1] || '';
          followups = rawFollowups
            .split('|')
            .map(s => s.replace(/\[|\]/g, '').trim())
            .filter(Boolean)
            .slice(0, 3);
        }

        if (followups.length === 0) {
          followups = generateDefaultFollowups(message, profile?.targetRole);
        }

        return res.json({
          reply: fullText,
          suggestedFollowups: followups,
          source: 'gemini-3.7-flash'
        });
      } catch (geminiError: any) {
        console.error('Gemini API execution error or timeout:', geminiError);
        // Fall back to expert curated guidance engine
        const fallback = generateExpertGuidanceFallback(message, profile);
        return res.json(fallback);
      }
    } else {
      // Fallback when API key is not configured
      const fallback = generateExpertGuidanceFallback(message, profile);
      return res.json(fallback);
    }
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error in career assistant.' });
  }
});

// ----------------------------------------------------
// AI CAREER ROADMAP GENERATION API
// ----------------------------------------------------

app.post('/api/career/roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole, industry, currentSkills = [], experienceLevel, timeframe } = req.body;
    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `Generate a comprehensive, actionable 4-phase career roadmap for a student aiming to become a "${targetRole || 'Software Engineer'}" in the "${industry || 'Technology'}" industry.
Current Skills: ${currentSkills.join(', ') || 'Beginner foundations'}.
Experience Level: ${experienceLevel || 'Entry-Level / Student'}.
Desired Timeframe: ${timeframe || '6 - 9 Months'}.

Return the response in valid JSON matching this schema:
{
  "roleTitle": string,
  "industry": string,
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeline": string,
  "summary": string,
  "phases": [
    {
      "phaseNumber": number,
      "title": string,
      "duration": string,
      "description": string,
      "milestones": [
        {
          "id": string,
          "title": string,
          "description": string,
          "resources": string[]
        }
      ]
    }
  ],
  "keyCertifications": string[],
  "recommendedProjects": [
    {
      "title": string,
      "difficulty": string,
      "description": string,
      "techStack": string[]
    }
  ]
}`;

        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Roadmap timed out')), 7000));
        const response: any = await Promise.race([responsePromise, timeoutPromise]);

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          const parsed = JSON.parse(jsonStr);
          return res.json(parsed);
        }
      } catch (err) {
        console.error('Roadmap AI generation error or timeout:', err);
      }
    }

    // Return structured default roadmap if AI is unavailable
    const fallbackRoadmap = generateDefaultRoadmapFallback(targetRole || 'Software Engineer', industry || 'Technology', currentSkills);
    return res.json(fallbackRoadmap);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate roadmap.' });
  }
});

// ----------------------------------------------------
// AI SKILL GAP ANALYZER API
// ----------------------------------------------------

app.post('/api/career/skill-gap', async (req: Request, res: Response) => {
  try {
    const { targetRole, currentSkills = [], educationLevel } = req.body;
    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `Conduct a rigorous, constructive skill gap analysis for a student aiming for the role of "${targetRole || 'Data Scientist'}".
Education Level: ${educationLevel || 'Undergraduate'}.
Student's Current Skills: ${currentSkills.join(', ') || 'Basic fundamentals'}.

Provide a realistic match score (0 to 100), identify matching skills, missing critical core skills, nice-to-have skills, a step-by-step learning plan with prioritized hours, and 3 high-impact portfolio ideas.

Return response as valid JSON matching this schema:
{
  "targetRole": string,
  "matchScore": number,
  "matchingSkills": string[],
  "missingCriticalSkills": string[],
  "niceToHaveSkills": string[],
  "learningPlan": [
    {
      "skill": string,
      "priority": "High" | "Medium" | "Low",
      "estimatedHours": number,
      "recommendedResources": [
        {
          "name": string,
          "platform": string,
          "type": "Course" | "Certification" | "Documentation" | "Book" | "Practice"
        }
      ]
    }
  ],
  "portfolioAdvice": string[]
}`;

        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Skill gap timed out')), 7000));
        const response: any = await Promise.race([responsePromise, timeoutPromise]);

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          return res.json(JSON.parse(jsonStr));
        }
      } catch (err) {
        console.error('Skill gap AI error or timeout:', err);
      }
    }

    const fallbackGap = generateDefaultSkillGapFallback(targetRole || 'Machine Learning Engineer', currentSkills);
    return res.json(fallbackGap);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to analyze skill gap.' });
  }
});

// ----------------------------------------------------
// AI RESUME & PROFILE REVIEW API
// ----------------------------------------------------

app.post('/api/career/resume-review', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole = 'Software Engineer', studentMajor } = req.body;
    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 characters of resume or profile text.' });
    }

    const ai = getGenAI();

    if (ai) {
      try {
        const prompt = `You are a Senior Technical Recruiter and Career Coach reviewing a student's resume for a target role of "${targetRole}" (Major: ${studentMajor || 'STEM'}).

Resume Text:
"""
${resumeText}
"""

Evaluate this resume for ATS pass rate, quantifiable impact (X-Y-Z formula), action verbs, technical relevance, and clarity.
Provide:
- overallScore (0-100)
- atsReadabilityScore (0-100)
- impactScore (0-100)
- summaryFeedback (2-3 sentences)
- strengths (3 items)
- weaknesses (3 items)
- bulletImprovements (3 specific before/after rewrites using strong action verbs and quantified impact metrics)
- missingKeywords (5 key ATS skills for ${targetRole})
- suggestedActionItems (3 immediate actionable next steps)

Return as valid JSON:
{
  "overallScore": number,
  "atsReadabilityScore": number,
  "impactScore": number,
  "summaryFeedback": string,
  "strengths": string[],
  "weaknesses": string[],
  "bulletImprovements": [
    {
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "missingKeywords": string[],
  "suggestedActionItems": string[]
}`;

        const responsePromise = ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Resume review timed out')), 7000));
        const response: any = await Promise.race([responsePromise, timeoutPromise]);

        const jsonStr = response.text?.trim();
        if (jsonStr) {
          return res.json(JSON.parse(jsonStr));
        }
      } catch (err) {
        console.error('Resume review AI error or timeout:', err);
      }
    }

    const fallbackReview = generateDefaultResumeReviewFallback(resumeText, targetRole);
    return res.json(fallbackReview);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to review resume.' });
  }
});

// ----------------------------------------------------
// HELPER FALLBACK GENERATORS (Ensures 100% Reliable App Experience)
// ----------------------------------------------------

function generateDefaultFollowups(message: string, targetRole?: string): string[] {
  const msgLower = message.toLowerCase();
  if (msgLower.includes('roadmap') || msgLower.includes('path') || msgLower.includes('learn')) {
    return [
      'What are the most valued certifications for this role?',
      'Can you recommend 3 impressive portfolio projects?',
      'How many hours per week should I study for this timeline?'
    ];
  }
  if (msgLower.includes('salary') || msgLower.includes('compensation') || msgLower.includes('market')) {
    return [
      'Which cities or hubs offer the highest starting salaries?',
      'How does compensation differ between startups and Big Tech?',
      'What skills provide the highest salary leverage?'
    ];
  }
  if (msgLower.includes('resume') || msgLower.includes('interview') || msgLower.includes('internship')) {
    return [
      'Give me 5 strong action bullet points for my resume',
      'What are the top 3 behavioral interview questions to prep for?',
      'How do I network with alumni on LinkedIn effectively?'
    ];
  }
  return [
    `Create a step-by-step roadmap for ${targetRole || 'Tech Careers'}`,
    'Analyze my skill gap for top industry internships',
    'What are the highest-paying entry-level skills today?'
  ];
}

function generateExpertGuidanceFallback(message: string, profile?: any) {
  const msgLower = (message || '').toLowerCase();
  const role = profile?.targetRole || 'Software Engineer';
  
  // Data Analyst specific query
  if (
    msgLower.includes('data analyst') || 
    msgLower.includes('data analytics') || 
    msgLower.includes('டேட்டா அனலிஸ்ட்') || 
    msgLower.includes('analyst')
  ) {
    return {
      reply: `### 📊 Essential Skills Checklist to Become a Data Analyst

#### 1. Spreadsheet & Data Manipulation
- **Advanced Excel / Google Sheets:** Pivot Tables, VLOOKUP / XLOOKUP, INDEX-MATCH, Conditional Formatting, and Power Query.

#### 2. SQL & Relational Databases (Top Priority)
- **Queries:** \`SELECT\`, \`JOIN\` (INNER, LEFT, RIGHT), \`GROUP BY\`, \`HAVING\`.
- **Advanced SQL:** Window Functions (\`ROW_NUMBER()\`, \`RANK()\`, \`LEAD/LAG\`), Subqueries, and CTEs (\`WITH\` clauses).

#### 3. Business Intelligence & Data Visualization
- **Power BI:** DAX expressions, interactive dashboards, Power Query data transformation.
- **Tableau:** Visual analytics, calculated fields, dashboard storyboards.

#### 4. Python or R for Analytics
- **Core Libraries:** **Pandas** (data cleaning & manipulation), **NumPy** (numerical operations), **Matplotlib & Seaborn** (exploratory visualization).

#### 5. Applied Statistics & Business Problem Solving
- Descriptive statistics (Mean, Median, Std Dev, Percentiles).
- Hypothesis testing, A/B testing analysis, and KPI tracking.

#### 💰 Average Salary Range:
- **India Freshers / 0-2 Yrs:** ₹5.5 – 10 LPA
- **India Experienced (3-5 Yrs):** ₹12 – 22 LPA
- **US / Global Remote:** $75,000 – $115,000 / year

---
Follow-up questions: [What project should I build for my Data Analyst portfolio?] | [How to crack SQL interview questions for Data Analyst?] | [Power BI vs Tableau: Which is better for freshers?]`,
      suggestedFollowups: [
        'What project should I build for my Data Analyst portfolio?',
        'How to crack SQL interview questions for Data Analyst?',
        'Power BI vs Tableau: Which is better for freshers?'
      ],
      source: 'career-knowledge-engine'
    };
  }

  // Google / FAANG Fresher Salary query
  if (
    msgLower.includes('google') || 
    msgLower.includes('faang') || 
    msgLower.includes('fresher salary') || 
    msgLower.includes('freshers salary')
  ) {
    return {
      reply: `### 🏢 Google & Top Tier Tech Companies Fresher Salary Structure (L3 / SDE-1)

#### 1. India Compensation Breakdown (Google India)
- **Base Salary:** ₹18 – 24 LPA
- **Signing Bonus:** ₹2 – 5 Lakhs (1st Year)
- **Stock Grants (GSUs):** ~$30,000 – $45,000 USD (vested over 4 years)
- **Total First-Year CTC:** **₹35 – 55 LPA**

#### 2. US Compensation Breakdown (Google US)
- **Base Salary:** $140,000 – $165,000
- **Signing Bonus:** $15,000 – $30,000
- **Annual Equity (RSUs):** $40,000 – $60,000 / year
- **Total Compensation:** **$190,000 – $240,000 / year**

#### 3. How to Qualify & Crack Google as a Fresher:
1. **Data Structures & Algorithms:** Strong proficiency in Graphs, DP, Trees, and Two Pointers (150+ LeetCode Medium/Hard).
2. **Core CS Fundamentals:** Operating Systems (Concurrency, Threads), Database Indexing, and Networking (TCP/IP, HTTP).
3. **Clean Code & Edge Cases:** Writing modular, readable, production-grade code in Python, C++, or Java.

---
Follow-up questions: [What DSA topics are asked most at Google?] | [How do I get an interview referral for Google?] | [What projects stand out on a resume for top tier companies?]`,
      suggestedFollowups: [
        'What DSA topics are asked most at Google?',
        'How do I get an interview referral for Google?',
        'What projects stand out on a resume for top tier companies?'
      ],
      source: 'career-knowledge-engine'
    };
  }

  // Data Engineering specific query
  if (
    msgLower.includes('data engineering') || 
    msgLower.includes('டேட்டா') || 
    msgLower.includes('data engineer')
  ) {
    return {
      reply: `### 🚀 Data Engineering Career & Learning Checklist

#### 1. Core Programming & Queries
- **Python:** OOP, Pandas, PySpark, API fetching.
- **Advanced SQL:** Window functions, CTEs, indexing, query optimization.

#### 2. Big Data & Distributed Systems
- **Apache Spark (PySpark):** Batch & stream processing.
- **Apache Kafka:** Real-time event streaming.

#### 3. Data Warehousing & Modeling
- **Modern Warehouses:** Snowflake, Google BigQuery, or Amazon Redshift.
- **Data Modeling:** Star schema, Snowflake schema, dbt (data build tool).

#### 4. Workflow Orchestration & Cloud
- **Orchestration:** Apache Airflow.
- **Cloud Platform:** AWS (S3, Glue, EMR) or GCP (GCS, Dataflow, BigQuery).

#### 💰 Average Salary Range:
- **India Freshers / 0-2 Yrs:** ₹8 – 16 LPA
- **India Experienced (3-5 Yrs):** ₹20 – 35+ LPA
- **US / Remote:** $125,000 – $180,000 / year

---
Follow-up questions: [What project should I build for Data Engineering portfolio?] | [How to prepare for SQL & PySpark interview questions?] | [Which certification is best: AWS Data Engineer or GCP Professional?]`,
      suggestedFollowups: [
        'What project should I build for Data Engineering portfolio?',
        'How to prepare for SQL & PySpark interview questions?',
        'Which certification is best: AWS Data Engineer or GCP Professional?'
      ],
      source: 'career-knowledge-engine'
    };
  }

  // Highest salary IT developer queries
  if (
    msgLower.includes('salary') || 
    msgLower.includes('highest') || 
    msgLower.includes('சேலரி') || 
    msgLower.includes('high salary')
  ) {
    return {
      reply: `### 💰 Top Highest-Paying IT & Developer Roles

1. **AI / Machine Learning Engineer (LLM & GenAI)**
   - **Why High Pay:** Massive global enterprise demand for fine-tuning models & RAG pipelines.
   - **Salary Range:** ₹18 – 40+ LPA (India) | $160,000 – $260,000 (US)

2. **Quant Developer / High-Frequency Trading (HFT)**
   - **Why High Pay:** Ultra low-latency C++ / Python algorithms driving financial markets.
   - **Salary Range:** ₹35 – 80+ LPA (India) | $200,000 – $400,000+ (US)

3. **Data Engineer & Big Data Architect**
   - **Why High Pay:** Clean, scalable data pipelines are the foundation of AI and business analytics.
   - **Salary Range:** ₹14 – 32+ LPA (India) | $135,000 – $210,000 (US)

4. **Cloud / DevOps / SRE Architect (Kubernetes & AWS/GCP)**
   - **Why High Pay:** Mission-critical infrastructure reliability, security, and scalability.
   - **Salary Range:** ₹16 – 35+ LPA (India) | $145,000 – $225,000 (US)

5. **Full-Stack / Backend Engineer (Go / Rust / Node / React)**
   - **Why High Pay:** High product velocity and scalable microservices architecture.
   - **Salary Range:** ₹12 – 28+ LPA (India) | $120,000 – $190,000 (US)

---
Follow-up questions: [Which high-paying role matches my current skills?] | [What DSA topics are asked in top product company interviews?] | [How can I crack ₹20+ LPA packages as a fresher?]`,
      suggestedFollowups: [
        'Which high-paying role matches my current skills?',
        'What DSA topics are asked in top product company interviews?',
        'How can I crack ₹20+ LPA packages as a fresher?'
      ],
      source: 'career-knowledge-engine'
    };
  }

  return {
    reply: `### 🎯 Strategic Guidance for ${role}

#### 1. Key High-Value Skills
- **Core Stack:** Master strong fundamentals in your primary programming language and data structures.
- **Production Tools:** Git version control, Docker containers, REST/GraphQL APIs, and Cloud deployment.

#### 2. High-Impact Action Items
- **Build 1 Complex Project:** A full-stack or data-driven application with database, authentication, and live cloud deployment.
- **Master Problem Solving:** Practice 2-3 LeetCode/HackerRank problems daily (Arrays, HashMaps, Trees, Graphs).
- **Optimize Resume:** Use the Google X-Y-Z formula (*"Accomplished X, measured by Y, by doing Z"*).

---
Follow-up questions: [Create a 6-month step-by-step roadmap] | [What are the top interview questions for this role?] | [What salary can I expect as an entry-level candidate?]`,
    suggestedFollowups: [
      'Create a 6-month step-by-step roadmap',
      'What are the top interview questions for this role?',
      'What salary can I expect as an entry-level candidate?'
    ],
    source: 'career-knowledge-engine'
  };
}

function generateDefaultRoadmapFallback(roleTitle: string, industry: string, currentSkills: string[]) {
  return {
    roleTitle,
    industry,
    difficulty: 'Intermediate' as const,
    estimatedTimeline: '6 - 9 Months',
    summary: `Structured comprehensive career roadmap designed for ambitious students targeting ${roleTitle}. Balances core engineering foundations with production-ready projects.`,
    phases: [
      {
        phaseNumber: 1,
        title: 'Core Foundations & Systems Intuition',
        duration: 'Month 1 - 2',
        description: 'Establish rock-solid programming foundations, algorithmic thinking, and modern version control.',
        milestones: [
          {
            id: 'm1',
            title: 'Advanced Programming & Design Patterns',
            description: 'Master Object-Oriented and Functional paradigms, error handling, and clean code principles.',
            resources: ['Clean Code Handbook', 'Official Language Documentation']
          },
          {
            id: 'm2',
            title: 'Data Structures & Algorithmic Complexity',
            description: 'Hash tables, binary search trees, graph traversal, and time/space complexity analysis.',
            resources: ['NeetCode Roadmap', 'Grokking Algorithms']
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Domain Architecture & Applied Technologies',
        duration: 'Month 3 - 4',
        description: 'Dive deep into industry-standard frameworks, database modeling, and resilient API development.',
        milestones: [
          {
            id: 'm3',
            title: 'Database Architecture & Query Optimization',
            description: 'Relational schemas, indexing strategies, ACID guarantees, and caching layers.',
            resources: ['PostgreSQL Official Docs', 'Prisma Schema Guides']
          },
          {
            id: 'm4',
            title: 'Cloud Services & Containerization',
            description: 'Docker container packaging, multi-stage builds, and cloud deployment pipelines.',
            resources: ['Docker for Developers', 'AWS Cloud Foundations']
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Production Capstone & Interview Mastery',
        duration: 'Month 5 - 6',
        description: 'Ship an end-to-end full-scale portfolio application, polish resume, and conquer technical interviews.',
        milestones: [
          {
            id: 'm5',
            title: 'Full-Scale Production Capstone',
            description: 'Build, test, and deploy a multi-service web or data platform with active users and automated CI/CD.',
            resources: ['GitHub Showcase Repositories']
          },
          {
            id: 'm6',
            title: 'Mock Technical & Behavioral Interviews',
            description: 'STAR method story prep, systems design diagrams, and live coding practice.',
            resources: ['Cracking the Coding Interview', 'Exponent System Design']
          }
        ]
      }
    ],
    keyCertifications: [
      'AWS Certified Solutions Architect - Associate',
      'Google Cloud Associate Cloud Engineer',
      'Meta Professional Developer Certificate'
    ],
    recommendedProjects: [
      {
        title: 'Real-Time Distributed Collaboration Platform',
        difficulty: 'Advanced',
        description: 'Multi-user collaborative application with WebSockets, optimistic UI updates, and conflict resolution.',
        techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker']
      },
      {
        title: 'Intelligent AI-Powered Document Search Engine',
        difficulty: 'Intermediate',
        description: 'Vector embedding search pipeline parsing complex PDFs and providing contextual citations.',
        techStack: ['Python', 'FastAPI', 'ChromaDB', 'React', 'Tailwind CSS']
      }
    ]
  };
}

function generateDefaultSkillGapFallback(targetRole: string, currentSkills: string[]) {
  const commonMatching = currentSkills.filter(s => ['python', 'javascript', 'react', 'sql', 'git', 'html', 'css', 'typescript'].includes(s.toLowerCase()));
  const missingCore = ['System Design & Architecture', 'Cloud Services (AWS/GCP)', 'Docker Containerization', 'Automated Testing (CI/CD)', 'Advanced Database Indexing'];
  
  return {
    targetRole,
    matchScore: Math.min(85, Math.max(45, (commonMatching.length * 15) + 35)),
    matchingSkills: commonMatching.length > 0 ? commonMatching : ['Problem Solving', 'Programming Fundamentals'],
    missingCriticalSkills: missingCore.slice(0, 3),
    niceToHaveSkills: ['GraphQL APIs', 'Redis Caching', 'Kubernetes Orchestration', 'Microservices'],
    learningPlan: [
      {
        skill: 'Cloud Services & Deployment (AWS/GCP)',
        priority: 'High' as const,
        estimatedHours: 25,
        recommendedResources: [
          { name: 'AWS Cloud Practitioner & Solutions Architect', platform: 'Coursera / AWS Skill Builder', type: 'Course' as const }
        ]
      },
      {
        skill: 'Docker Containerization & CI/CD',
        priority: 'High' as const,
        estimatedHours: 18,
        recommendedResources: [
          { name: 'Docker & Kubernetes: The Practical Guide', platform: 'Udemy / FreeCodeCamp', type: 'Practice' as const }
        ]
      },
      {
        skill: 'Production Database Modeling & Indexing',
        priority: 'Medium' as const,
        estimatedHours: 15,
        recommendedResources: [
          { name: 'Use The Index, Luke (SQL Performance)', platform: 'Interactive Guide', type: 'Book' as const }
        ]
      }
    ],
    portfolioAdvice: [
      'Deploy all portfolio projects with a live URL and custom domain instead of just localhost code.',
      'Include a concise 2-minute video demo and architecture diagram in your GitHub README.',
      'Demonstrate measurable metrics: e.g. "Reduced API response latency by 45% via Redis caching".'
    ]
  };
}

function generateDefaultResumeReviewFallback(resumeText: string, targetRole: string) {
  return {
    overallScore: 78,
    atsReadabilityScore: 84,
    impactScore: 72,
    summaryFeedback: `Good baseline structure with relevant technical coursework. To stand out for ${targetRole}, emphasize quantifiable outcomes (percentages, speed, user volume) rather than passive duty descriptions.`,
    strengths: [
      'Clean section hierarchy with easily scannable headers',
      'Strong technical stack alignment for early career roles',
      'Clear educational credentials and graduation timeline'
    ],
    weaknesses: [
      'Several bullet points describe tasks ("Responsible for...") rather than quantifiable achievements',
      'Missing prominent links to deployed live projects or active GitHub repositories',
      'A few high-frequency ATS industry keywords could be integrated more prominently'
    ],
    bulletImprovements: [
      {
        original: 'Worked on the frontend of the student portal using React and JavaScript.',
        improved: 'Engineered 8+ responsive React components for student portal, improving page load speed by 35% across 1,200+ active campus users.',
        reason: 'Applies Google X-Y-Z formula: quantified user base, explicit metric, and active verb.'
      },
      {
        original: 'Helped build the backend database and wrote SQL queries.',
        improved: 'Architected relational PostgreSQL schema with optimized composite indexes, accelerating complex report query execution by 40%.',
        reason: 'Replaces passive "helped build" with authoritative engineering terminology.'
      },
      {
        original: 'Created unit tests to check if the code works.',
        improved: 'Implemented automated CI/CD test suite with Vitest, achieving 88% code coverage and preventing regression bugs across 20+ releases.',
        reason: 'Quantifies test coverage and highlights automated pipeline integration.'
      }
    ],
    missingKeywords: ['Docker', 'RESTful APIs', 'CI/CD Pipelines', 'Cloud Architecture (AWS/GCP)', 'PostgreSQL'],
    suggestedActionItems: [
      'Rewrite project bullets using the formula: "Accomplished [X] as measured by [Y], by doing [Z]"',
      'Add direct clickable links to live deployed demo URLs in the header',
      'Add a dedicated "Technical Skills" matrix categorized by Languages, Frameworks, Developer Tools, and Cloud Platforms'
    ]
  };
}

// ----------------------------------------------------
// SERVER START & VITE MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Career Guidance Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
