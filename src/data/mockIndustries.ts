import { IndustryInsight } from '../types';

export const MOCK_INDUSTRIES: IndustryInsight[] = [
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    category: 'Information Technology',
    growthRate: '+34.5% YoY',
    demandLevel: 'Very High',
    averageStartingSalary: '$115,000 - $145,000',
    averageSeniorSalary: '$195,000 - $320,000',
    topRoles: [
      'Machine Learning Engineer',
      'AI Research Scientist',
      'LLM / GenAI Application Developer',
      'Computer Vision Specialist',
      'MLOps Engineer'
    ],
    emergingSkills: [
      'PyTorch',
      'Transformers & HuggingFace',
      'RAG & Vector Databases',
      'LangChain & LlamaIndex',
      'Model Fine-Tuning (LoRA)',
      'CUDA / GPU Optimization'
    ],
    hiringHubs: ['San Francisco Bay Area', 'Seattle', 'New York', 'Boston', 'London', 'Bangalore', 'Austin'],
    marketOverview: 'Generative AI and enterprise automation are transforming every sector. High demand exists for engineers who can bridge the gap between foundation models and scalable production systems.',
    futureOutlook: 'Expected to remain the fastest-growing tech segment over the next decade, with increased focus on multimodal systems, autonomous agents, and AI safety.'
  },
  {
    id: 'fullstack-cloud',
    name: 'Full-Stack Software & Cloud Architecture',
    category: 'Software Engineering',
    growthRate: '+22.8% YoY',
    demandLevel: 'Very High',
    averageStartingSalary: '$85,000 - $120,000',
    averageSeniorSalary: '$160,000 - $250,000',
    topRoles: [
      'Full-Stack Developer',
      'Backend Engineer (Go/Rust/Node)',
      'Cloud Solutions Architect (AWS/GCP/Azure)',
      'DevOps / Site Reliability Engineer',
      'API Platform Engineer'
    ],
    emergingSkills: [
      'Next.js & TypeScript',
      'Kubernetes & Docker',
      'Serverless Architectures',
      'PostgreSQL & Distributed DBs',
      'Terraform / IaC',
      'GraphQL & gRPC'
    ],
    hiringHubs: ['San Francisco', 'New York', 'Austin', 'Berlin', 'Toronto', 'Singapore', 'Remote Worldwide'],
    marketOverview: 'Core software engineering remains the bedrock of the digital economy. Modern employers look for full-stack versatility paired with strong cloud-native infrastructure skills.',
    futureOutlook: 'Steady long-term growth. Emphasis is shifting toward developer productivity, serverless edge computing, and AI-augmented software development.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Information Defense',
    category: 'Security & Infrastructure',
    growthRate: '+31.0% YoY',
    demandLevel: 'Very High',
    averageStartingSalary: '$90,000 - $125,000',
    averageSeniorSalary: '$170,000 - $265,000',
    topRoles: [
      'Security Operations Center (SOC) Analyst',
      'Penetration Tester / Ethical Hacker',
      'Cloud Security Architect',
      'Incident Response Specialist',
      'Application Security Engineer'
    ],
    emergingSkills: [
      'Zero-Trust Architecture',
      'Threat Hunting & SIEM (Splunk, Sentinel)',
      'Network Security & WireShark',
      'CISSP / CompTIA Security+',
      'Cloud Security Posture Management',
      'Cryptographic Protocols'
    ],
    hiringHubs: ['Washington D.C. / Northern Virginia', 'San Jose', 'Dallas', 'Tel Aviv', 'London', 'Tokyo'],
    marketOverview: 'Global regulatory pressures and rising ransomware threats have created an acute worldwide talent shortage of over 3.5 million cybersecurity professionals.',
    futureOutlook: 'Recession-proof sector with mandatory corporate budget allocations and expanding cloud defense requirements.'
  },
  {
    id: 'data-analytics',
    name: 'Data Science & Business Intelligence',
    category: 'Data & Analytics',
    growthRate: '+27.2% YoY',
    demandLevel: 'High',
    averageStartingSalary: '$80,000 - $110,000',
    averageSeniorSalary: '$150,000 - $230,000',
    topRoles: [
      'Data Scientist',
      'Analytics Engineer (dbt, Snowflake)',
      'Business Intelligence Analyst',
      'Data Platform Engineer',
      'Quantitative Analyst'
    ],
    emergingSkills: [
      'SQL & Advanced Analytics',
      'Python (Pandas, Polars, Scikit-learn)',
      'Snowflake & Databricks',
      'Tableau / PowerBI / Looker',
      'A/B Testing & Statistical Modeling',
      'dbt (Data Build Tool)'
    ],
    hiringHubs: ['New York', 'Chicago', 'San Francisco', 'Boston', 'London', 'Amsterdam', 'Bangalore'],
    marketOverview: 'Companies are transitioning from raw data collection to predictive decision engines, driving demand for practitioners who translate metrics into executive strategy.',
    futureOutlook: 'Evolving rapidly into analytics engineering and real-time streaming data pipelines.'
  },
  {
    id: 'product-design',
    name: 'Product Management & UI/UX Design',
    category: 'Product & Creative',
    growthRate: '+19.5% YoY',
    demandLevel: 'High',
    averageStartingSalary: '$78,000 - $108,000',
    averageSeniorSalary: '$155,000 - $240,000',
    topRoles: [
      'Associate Product Manager (APM)',
      'Product Designer (UI/UX)',
      'Design Systems Lead',
      'User Researcher',
      'Technical Product Manager'
    ],
    emergingSkills: [
      'Figma & Prototyping',
      'User Journey Mapping & Usability Testing',
      'Product Metrics (North Star, CAC, LTV)',
      'Agile / Scrum Methodologies',
      'Design Tokens & Accessibility (WCAG)',
      'AI-Powered Product UX'
    ],
    hiringHubs: ['San Francisco', 'New York', 'Los Angeles', 'London', 'Stockholm', 'Sydney'],
    marketOverview: 'Great software wins on seamless user experience. APM programs and product design roles are among the most competitive and rewarding for multidisciplinary students.',
    futureOutlook: 'Expanding focus on multimodal interfaces, spatial computing, and frictionless AI workflows.'
  },
  {
    id: 'clean-energy-climate',
    name: 'Clean Energy & Climate Technology',
    category: 'Engineering & Sustainability',
    growthRate: '+29.0% YoY',
    demandLevel: 'Growing Rapidly',
    averageStartingSalary: '$82,000 - $115,000',
    averageSeniorSalary: '$145,000 - $220,000',
    topRoles: [
      'Renewable Energy Systems Engineer',
      'Battery / Energy Storage Specialist',
      'Carbon Accounting Analyst',
      'Smart Grid Software Engineer',
      'Sustainability Consultant'
    ],
    emergingSkills: [
      'Power Systems Modeling',
      'MATLAB / Simulink',
      'ESG Reporting Frameworks (GRI, SASB)',
      'IoT Sensor Networks',
      'Battery Chemistry & Management (BMS)',
      'Environmental Impact Assessment'
    ],
    hiringHubs: ['Denver / Boulder', 'San Francisco', 'Houston', 'Munich', 'Copenhagen', 'Seoul'],
    marketOverview: 'Billions in green infrastructure funding and corporate net-zero pledges are opening unprecedented engineering and advisory careers.',
    futureOutlook: 'Long-term structural demand fueled by global energy transition, EV scale-up, and carbon management policies.'
  },
  {
    id: 'biotech-healthcare',
    name: 'Biotechnology & Health Informatics',
    category: 'Life Sciences & Healthcare',
    growthRate: '+24.6% YoY',
    demandLevel: 'High',
    averageStartingSalary: '$80,000 - $112,000',
    averageSeniorSalary: '$150,000 - $235,000',
    topRoles: [
      'Bioinformatics Scientist',
      'Computational Biologist',
      'Health Data Analyst',
      'Clinical Research Associate',
      'Medical Device Software Engineer'
    ],
    emergingSkills: [
      'R / Bioconductor & Python',
      'Next-Gen Sequencing (NGS) Analysis',
      'Genomics & AlphaFold Modeling',
      'FDA Regulatory Compliance (HIPAA, 21 CFR)',
      'Clinical Trial Data Management',
      'Molecular Modeling'
    ],
    hiringHubs: ['Boston / Cambridge', 'San Diego', 'San Francisco', 'Basel', 'Oxford', 'Singapore'],
    marketOverview: 'Intersection of computer science and biology is revolutionizing precision medicine, drug discovery, and genomic sequencing.',
    futureOutlook: 'Massive runway with AI-driven drug discovery, mRNA therapeutics, and digital health platforms.'
  },
  {
    id: 'fintech-quant',
    name: 'Quantitative Finance & FinTech',
    category: 'Finance & Technology',
    growthRate: '+21.0% YoY',
    demandLevel: 'High',
    averageStartingSalary: '$105,000 - $160,000',
    averageSeniorSalary: '$220,000 - $450,000+',
    topRoles: [
      'Quantitative Trader / Researcher',
      'Fintech Backend Architect',
      'Risk Modeling Analyst',
      'Blockchain Protocol Engineer',
      'Algorithmic Trading Developer (C++)'
    ],
    emergingSkills: [
      'Low-Latency C++ & Rust',
      'Stochastic Calculus & Probability',
      'High-Frequency Trading Architecture',
      'Python for Quantitative Modeling',
      'Financial Regulations (SEC, FINRA)',
      'DeFi / Smart Contract Security'
    ],
    hiringHubs: ['New York', 'Chicago', 'London', 'Hong Kong', 'Singapore', 'Zurich'],
    marketOverview: 'High compensation and technical rigor. Demands stellar mathematical, statistical, and systems programming foundations.',
    futureOutlook: 'Continued expansion into automated market making, decentralized settlement, and AI risk prediction.'
  }
];
