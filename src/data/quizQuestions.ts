import { QuizQuestion, QuizResult } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'When starting a new project, what part of the work excites you the most?',
    category: 'Work Style',
    options: [
      { label: 'Architecting the technical system, writing clean code, and solving complex logic bugs', scoreTrait: 'technical', weight: 3 },
      { label: 'Digging into data, uncovering statistical patterns, and finding mathematical insights', scoreTrait: 'analytical', weight: 3 },
      { label: 'Designing the look and feel, user journey, and creating intuitive visual aesthetics', scoreTrait: 'creative', weight: 3 },
      { label: 'Pitching the vision, coordinating people, and defining the product strategy / roadmap', scoreTrait: 'enterprising', weight: 3 }
    ]
  },
  {
    id: 2,
    question: 'Which type of problem would you find most satisfying to solve over the next 6 months?',
    category: 'Problem Solving',
    options: [
      { label: 'Building an AI system that automates a laborious manual process or predicts outcomes', scoreTrait: 'investigative', weight: 3 },
      { label: 'Securing a critical cloud infrastructure against malicious attacks and cyber breaches', scoreTrait: 'technical', weight: 3 },
      { label: 'Mentoring teammates, interviewing users, and solving workplace collaboration roadblocks', scoreTrait: 'social', weight: 3 },
      { label: 'Launching a new venture or tech product to gain market share and revenue', scoreTrait: 'enterprising', weight: 3 }
    ]
  },
  {
    id: 3,
    question: 'What kind of tools or environments do you prefer spending your day in?',
    category: 'Environment',
    options: [
      { label: 'Code editors (VS Code), terminal CLI, Git repos, and cloud consoles (AWS/GCP)', scoreTrait: 'technical', weight: 3 },
      { label: 'Figma, Adobe Creative Cloud, 3D engines, and prototyping canvas tools', scoreTrait: 'creative', weight: 3 },
      { label: 'Jupyter Notebooks, SQL queries, Pandas, Tableau dashboards, and Excel models', scoreTrait: 'analytical', weight: 3 },
      { label: 'Whiteboards, presentation slides, client meetings, and sprint planning boards', scoreTrait: 'enterprising', weight: 3 }
    ]
  },
  {
    id: 4,
    question: 'If you were given $50,000 for a student passion initiative, where would you allocate it?',
    category: 'Values & Passion',
    options: [
      { label: 'Buying GPU computing clusters to train custom deep learning models or open source tools', scoreTrait: 'technical', weight: 3 },
      { label: 'Conducting community user research and launching a non-profit educational platform', scoreTrait: 'social', weight: 3 },
      { label: 'Building a clean energy prototype or biotech health diagnostic device', scoreTrait: 'investigative', weight: 3 },
      { label: 'Producing an interactive multimedia experience, brand design system, or indie video game', scoreTrait: 'creative', weight: 3 }
    ]
  },
  {
    id: 5,
    question: 'How do you prefer to measure your career success and daily impact?',
    category: 'Success Metrics',
    options: [
      { label: 'Robustness, speed, uptime, and elegant engineering scalability of systems I built', scoreTrait: 'technical', weight: 3 },
      { label: 'Delight, accessibility, emotional resonance, and ease of use for real humans', scoreTrait: 'creative', weight: 3 },
      { label: 'Accuracy, predictive power, and data-backed ROI of insights I discovered', scoreTrait: 'analytical', weight: 3 },
      { label: 'Business growth, market adoption, revenue generated, and teams led', scoreTrait: 'enterprising', weight: 3 }
    ]
  },
  {
    id: 6,
    question: 'What type of learning style resonates most with you?',
    category: 'Learning Strategy',
    options: [
      { label: 'Reading research papers, experimenting with algorithms, and testing hypotheses', scoreTrait: 'investigative', weight: 3 },
      { label: 'Building hands-on projects, breaking things, and looking at open source code', scoreTrait: 'technical', weight: 3 },
      { label: 'Collaborative case studies, group discussions, and strategic debate', scoreTrait: 'social', weight: 3 },
      { label: 'Visual moodboards, UI critique sessions, and sketching interface wireframes', scoreTrait: 'creative', weight: 3 }
    ]
  }
];

export function calculateQuizResults(answers: Record<number, number>): QuizResult {
  const scores: Record<string, number> = {
    technical: 0,
    analytical: 0,
    creative: 0,
    enterprising: 0,
    investigative: 0,
    social: 0
  };

  let totalWeight = 0;

  QUIZ_QUESTIONS.forEach((q) => {
    const selectedOptionIndex = answers[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex]) {
      const opt = q.options[selectedOptionIndex];
      scores[opt.scoreTrait] = (scores[opt.scoreTrait] || 0) + opt.weight;
      totalWeight += opt.weight;
    }
  });

  const dominantTraits = Object.entries(scores)
    .map(([trait, score]) => ({
      trait: trait.charAt(0).toUpperCase() + trait.slice(1),
      percentage: totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const topTrait = dominantTraits[0]?.trait.toLowerCase() || 'technical';
  const secondTrait = dominantTraits[1]?.trait.toLowerCase() || 'analytical';

  let recommendedCareers: QuizResult['recommendedCareers'] = [];

  if (topTrait === 'technical' && secondTrait === 'investigative') {
    recommendedCareers = [
      {
        title: 'Machine Learning / AI Engineer',
        industry: 'Artificial Intelligence',
        matchScore: 96,
        description: 'Design and deploy deep learning models, LLM systems, and autonomous algorithms at scale.',
        averageSalary: '$120,000 - $185,000',
        entryRequirements: 'B.S. in CS / Data Science / Math, Python, PyTorch, Linear Algebra, Git.'
      },
      {
        title: 'Cloud Infrastructure & DevOps Engineer',
        industry: 'Cloud Computing',
        matchScore: 91,
        description: 'Build automated continuous integration pipelines, containerized clusters, and secure serverless clouds.',
        averageSalary: '$105,000 - $160,000',
        entryRequirements: 'Linux, Docker, Kubernetes, AWS/GCP, Terraform, CI/CD tools.'
      },
      {
        title: 'Cybersecurity Threat Analyst',
        industry: 'Cyber Defense',
        matchScore: 88,
        description: 'Safeguard organizational data, conduct vulnerability scans, and respond to cyber threat incidents.',
        averageSalary: '$95,000 - $140,000',
        entryRequirements: 'Networking fundamentals, CompTIA Security+, Wireshark, Linux, Python scripting.'
      }
    ];
  } else if (topTrait === 'creative' || secondTrait === 'creative') {
    recommendedCareers = [
      {
        title: 'Product Designer (UI/UX)',
        industry: 'Product & Design',
        matchScore: 95,
        description: 'Shape intuitive digital experiences, conduct user research, and build scalable design systems.',
        averageSalary: '$85,000 - $135,000',
        entryRequirements: 'Figma proficiency, Portfolio of 2-3 case studies, User journey mapping, Wireframing.'
      },
      {
        title: 'Creative Frontend Engineer',
        industry: 'Web & Interactive Tech',
        matchScore: 90,
        description: 'Bring visual designs to life with fluid animations, 3D WebGL interactions, and responsive UI architecture.',
        averageSalary: '$90,000 - $145,000',
        entryRequirements: 'React/Vue, Tailwind CSS, Motion/Three.js, TypeScript, Web Accessibility (WCAG).'
      },
      {
        title: 'Design Technologist / Design Systems Lead',
        industry: 'Product Engineering',
        matchScore: 87,
        description: 'Bridge the gap between pure visual design and engineering component libraries.',
        averageSalary: '$100,000 - $155,000',
        entryRequirements: 'Figma Tokens, Storybook, React, CSS Architecture, Component Design.'
      }
    ];
  } else if (topTrait === 'analytical' || secondTrait === 'analytical') {
    recommendedCareers = [
      {
        title: 'Data Scientist & Analytics Engineer',
        industry: 'Data & Analytics',
        matchScore: 94,
        description: 'Extract predictive value from massive datasets, build automated dashboards, and guide executive strategy.',
        averageSalary: '$95,000 - $150,000',
        entryRequirements: 'SQL mastery, Python (Pandas, Scikit-learn), Tableau/PowerBI, Statistics & A/B testing.'
      },
      {
        title: 'Quantitative Finance Analyst',
        industry: 'FinTech & Quant Trading',
        matchScore: 89,
        description: 'Model financial markets, build algorithmic trade strategies, and perform statistical arbitrage research.',
        averageSalary: '$115,000 - $200,000',
        entryRequirements: 'Strong Math/Physics/CS background, C++ or Python, Probability, Financial Modeling.'
      },
      {
        title: 'Health Informatics Specialist',
        industry: 'Biotech & Healthcare',
        matchScore: 86,
        description: 'Analyze clinical outcomes, genomic sequencing pipelines, and optimize hospital health records.',
        averageSalary: '$85,000 - $130,000',
        entryRequirements: 'R / Python, Bioinformatics databases, SQL, Health data privacy regulations.'
      }
    ];
  } else {
    recommendedCareers = [
      {
        title: 'Associate Product Manager (APM)',
        industry: 'Technology Management',
        matchScore: 93,
        description: 'Lead cross-functional engineering and design squads to define product roadmaps and customer value.',
        averageSalary: '$95,000 - $145,000',
        entryRequirements: 'Strategic prioritization, Agile/Scrum, Data analysis, Customer discovery, Communication.'
      },
      {
        title: 'Technical Solutions Architect',
        industry: 'Enterprise Software',
        matchScore: 89,
        description: 'Consult with enterprise clients to design tailored technical systems and lead implementation partnerships.',
        averageSalary: '$110,000 - $170,000',
        entryRequirements: 'Systems design, Cloud fundamentals, Executive presentations, Problem solving.'
      },
      {
        title: 'Growth & Technology Consultant',
        industry: 'Professional Services & Tech',
        matchScore: 85,
        description: 'Advise Fortune 500 companies and fast-growing startups on digital transformation and market expansion.',
        averageSalary: '$90,000 - $140,000',
        entryRequirements: 'Case interview preparation, Excel financial modeling, Slide deck storytelling, Market research.'
      }
    ];
  }

  return {
    dominantTraits,
    recommendedCareers,
    summary: `Your responses highlight a strong affinity for **${dominantTraits[0]?.trait}** and **${dominantTraits[1]?.trait}** disciplines. You thrive when solving real-world challenges with structural rigor, high creative expression, and measurable outcomes.`
  };
}
