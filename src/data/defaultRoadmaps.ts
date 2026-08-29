import { CareerRoadmap } from '../types';

export const DEFAULT_ROADMAPS: Record<string, CareerRoadmap> = {
  'ai-engineer': {
    roleTitle: 'Artificial Intelligence & Machine Learning Engineer',
    industry: 'Artificial Intelligence',
    difficulty: 'Advanced',
    estimatedTimeline: '8 - 12 Months',
    summary: 'A comprehensive curriculum from mathematical foundations to deploying production LLMs, fine-tuning neural networks, and optimizing MLOps pipelines.',
    phases: [
      {
        phaseNumber: 1,
        title: 'Mathematical Foundations & Python Mastery',
        duration: 'Month 1 - 2',
        description: 'Establish rock-solid intuition in linear algebra, multivariable calculus, probability, and advanced vectorized Python.',
        milestones: [
          {
            id: 'ai-m1',
            title: 'Linear Algebra & Matrix Operations',
            description: 'Eigenvalues, SVD, matrix transformations, vector spaces using NumPy.',
            resources: ['3Blue1Brown Essence of Linear Algebra', 'Fast.ai Computational Linear Algebra']
          },
          {
            id: 'ai-m2',
            title: 'Probability & Statistics for Machine Learning',
            description: 'Bayesian statistics, probability distributions, hypothesis testing, maximum likelihood estimation.',
            resources: ['Khan Academy Advanced Statistics', 'StatQuest with Josh Starmer']
          },
          {
            id: 'ai-m3',
            title: 'Modern Scientific Python Stack',
            description: 'NumPy, Pandas, Polars, Matplotlib, and Seaborn for exploratory data analysis.',
            resources: ['Python for Data Analysis (Wes McKinney)']
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Classical Machine Learning & Deep Learning Core',
        duration: 'Month 3 - 5',
        description: 'Understand loss functions, backpropagation from scratch, convolutional networks, and recurrent architectures.',
        milestones: [
          {
            id: 'ai-m4',
            title: 'Supervised & Unsupervised Learning',
            description: 'Linear/Logistic regression, Decision Trees, Random Forests, XGBoost, K-Means, and PCA using Scikit-Learn.',
            resources: ['Coursera Machine Learning Specialization by Andrew Ng']
          },
          {
            id: 'ai-m5',
            title: 'PyTorch Deep Learning Foundations',
            description: 'Tensors, Autograd, custom Dataset/DataLoader, building Multi-Layer Perceptrons, and CNNs.',
            resources: ['PyTorch Official Tutorials', 'Deep Learning with PyTorch (Manning)']
          },
          {
            id: 'ai-m6',
            title: 'Optimization & Regularization Techniques',
            description: 'AdamW, SGD with momentum, Dropout, Batch Normalization, Learning rate schedulers, gradient clipping.',
            resources: ['Stanford CS231n Convolutional Neural Networks']
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Transformers, Generative AI & LLM Systems',
        duration: 'Month 6 - 8',
        description: 'Master attention mechanisms, transformer blocks, retrieval augmented generation (RAG), and model fine-tuning.',
        milestones: [
          {
            id: 'ai-m7',
            title: 'Transformer Architecture & Self-Attention',
            description: 'Implement scaled dot-product attention, multi-head attention, positional encodings from scratch.',
            resources: ['The Illustrated Transformer (Jay Alammar)', 'HuggingFace NLP Course']
          },
          {
            id: 'ai-m8',
            title: 'RAG & Vector Search Engineering',
            description: 'ChromaDB, Pinecone, LangChain, semantic embeddings, hybrid search, and prompt chunking strategies.',
            resources: ['DeepLearning.AI Building Systems with ChatGPT API']
          },
          {
            id: 'ai-m9',
            title: 'Parameter-Efficient Fine-Tuning (PEFT)',
            description: 'LoRA, QLoRA, instruction tuning on open weights (Llama 3, Mistral) using HuggingFace TRL.',
            resources: ['HuggingFace PEFT Documentation', 'Weights & Biases Fine-Tuning Guides']
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'MLOps, Deployment & Portfolio Capstones',
        duration: 'Month 9 - 12',
        description: 'Ship production inference APIs, monitor model drift, optimize latency (vLLM, ONNX, TensorRT), and prepare for interviews.',
        milestones: [
          {
            id: 'ai-m10',
            title: 'Model Serving & Inference Optimization',
            description: 'FastAPI, Docker, vLLM, TensorRT-LLM, quantized models (GGUF/AWQ), batch inference.',
            resources: ['Full Stack LLM Bootcamp']
          },
          {
            id: 'ai-m11',
            title: 'Production Capstone Project',
            description: 'Build an end-to-end multimodal assistant or autonomous agent with evaluation metrics (RAGAS / BLEU).',
            resources: ['GitHub Open Source Showcases']
          },
          {
            id: 'ai-m12',
            title: 'System Design & Technical Interview Prep',
            description: 'Machine learning system design questions (recommendation engines, feed ranking, fraud detection).',
            resources: ['Designing Machine Learning Systems (Chip Huyen)']
          }
        ]
      }
    ],
    keyCertifications: [
      'AWS Certified Machine Learning - Specialty',
      'Google Cloud Professional Machine Learning Engineer',
      'TensorFlow Developer Certificate',
      'DeepLearning.AI Deep Learning Specialization'
    ],
    recommendedProjects: [
      {
        title: 'Real-Time Multimodal Document Intelligence System',
        difficulty: 'Advanced',
        description: 'Parse PDFs, extract tabular data, build vector embeddings, and support natural language queries with verified citations.',
        techStack: ['Python', 'FastAPI', 'ChromaDB', 'LlamaIndex', 'React', 'Docker']
      },
      {
        title: 'Fine-Tuned Domain Specialist Agent (Medical / Legal)',
        difficulty: 'Advanced',
        description: 'Fine-tune open-source models with QLoRA on domain datasets, evaluate with custom benchmark harnesses, and serve via vLLM.',
        techStack: ['PyTorch', 'HuggingFace TRL', 'Weights & Biases', 'vLLM']
      },
      {
        title: 'Edge AI Object Detection with TensorRT & WebRTC',
        difficulty: 'Intermediate',
        description: 'Deploy YOLOv8 or MobileNet for real-time video stream analytics with under 30ms latency.',
        techStack: ['OpenCV', 'TensorRT', 'Python', 'FastAPI', 'WebSockets']
      }
    ]
  },

  'fullstack-engineer': {
    roleTitle: 'Full-Stack Software Engineer',
    industry: 'Software Engineering',
    difficulty: 'Intermediate',
    estimatedTimeline: '6 - 9 Months',
    summary: 'Master modern frontend reactivity, resilient backend microservices, SQL/NoSQL database architecture, CI/CD cloud deployment, and system design.',
    phases: [
      {
        phaseNumber: 1,
        title: 'Modern Frontend & TypeScript Mastery',
        duration: 'Month 1 - 2',
        description: 'Develop deep expertise in TypeScript, modern React 19, Tailwind CSS, state machines, and responsive accessibility.',
        milestones: [
          {
            id: 'fs-m1',
            title: 'TypeScript Fundamentals to Advanced Types',
            description: 'Generics, union types, utility types, mapped types, and strict compiler configs.',
            resources: ['Total TypeScript by Matt Pocock', 'TypeScript Official Handbook']
          },
          {
            id: 'fs-m2',
            title: 'React 19 & Component Architecture',
            description: 'Hooks, custom hooks, Server Actions, suspense, memoization, and modular component patterns.',
            resources: ['React.dev Official Documentation', 'Kent C. Dodds Epic React']
          },
          {
            id: 'fs-m3',
            title: 'Tailwind CSS & Design Systems',
            description: 'Fluid typography, responsive bento grids, dark mode palettes, and Radix UI headless components.',
            resources: ['Tailwind CSS Documentation', 'Refactoring UI (Adam Wathan)']
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Backend Services, APIs & Database Systems',
        duration: 'Month 3 - 4',
        description: 'Design secure RESTful and GraphQL APIs, model relational databases in PostgreSQL, and manage caching with Redis.',
        milestones: [
          {
            id: 'fs-m4',
            title: 'Node.js & Express / Fastify Architecture',
            description: 'Middleware, authentication (JWT, OAuth2, Session cookies), rate limiting, and structured logging.',
            resources: ['Node.js Design Patterns (Mario Casciaro)']
          },
          {
            id: 'fs-m5',
            title: 'PostgreSQL & Prisma / Drizzle ORM',
            description: 'Schema modeling, indexing, foreign keys, ACID transactions, migrations, and query optimization.',
            resources: ['Use The Index, Luke (SQL Indexing)', 'Prisma Guides']
          },
          {
            id: 'fs-m6',
            title: 'In-Memory Caching & Message Queues',
            description: 'Redis caching strategies, pub/sub messaging, BullMQ background job workers.',
            resources: ['Redis University (RU101)']
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Cloud Infrastructure, DevOps & Testing',
        duration: 'Month 5 - 6',
        description: 'Containerize applications with Docker, automate deployment with GitHub Actions, and write unit/integration test suites.',
        milestones: [
          {
            id: 'fs-m7',
            title: 'Docker Containerization & Compose',
            description: 'Multi-stage Dockerfiles, image optimization, local multi-service orchestration.',
            resources: ['Docker for Developers (Colt Steele)']
          },
          {
            id: 'fs-m8',
            title: 'Automated CI/CD Pipelines with GitHub Actions',
            description: 'Linting, testing, security vulnerability auditing, and automated container deployment.',
            resources: ['GitHub Actions Documentation']
          },
          {
            id: 'fs-m9',
            title: 'End-to-End & Unit Testing',
            description: 'Vitest, React Testing Library, and Playwright for cross-browser regression testing.',
            resources: ['Testing JavaScript (Kent C. Dodds)']
          }
        ]
      },
      {
        phaseNumber: 4,
        title: 'System Design, Capstones & Interview Readiness',
        duration: 'Month 7 - 9',
        description: 'Build production full-stack capstones, master distributed system fundamentals, and conquer LeetCode / technical interviews.',
        milestones: [
          {
            id: 'fs-m10',
            title: 'High-Scale Full-Stack SaaS Capstone',
            description: 'Multi-tenant architecture, Stripe billing, role-based access control, and analytics.',
            resources: ['Next.js SaaS Boilerplate Patterns']
          },
          {
            id: 'fs-m11',
            title: 'System Design Foundations',
            description: 'Load balancers, CAP theorem, database sharding, CDN edge caching, microservices vs monoliths.',
            resources: ['System Design Interview by Alex Xu', 'Grokking Modern System Design']
          },
          {
            id: 'fs-m12',
            title: 'Data Structures & Algorithms Mastery',
            description: 'Trees, graphs, dynamic programming, two pointers, sliding window (Blind 75 & NeetCode 150).',
            resources: ['NeetCode.io', 'LeetCode Curated Lists']
          }
        ]
      }
    ],
    keyCertifications: [
      'AWS Certified Solutions Architect - Associate',
      'Meta Front-End / Back-End Professional Certificate',
      'HashiCorp Certified: Terraform Associate',
      'Docker Certified Associate (DCA)'
    ],
    recommendedProjects: [
      {
        title: 'Real-Time Collaborative Workspace (Notion/Miro Style)',
        difficulty: 'Advanced',
        description: 'WebSockets/CRDTs real-time collaborative document editing, rich markdown, presence indicators, and instant sync.',
        techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis', 'Docker']
      },
      {
        title: 'Enterprise Event-Driven E-Commerce API Platform',
        difficulty: 'Intermediate',
        description: 'Microservices for inventory, payment gateway processing (Stripe Webhooks), order fulfillment, and automated email receipts.',
        techStack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'BullMQ', 'Redis']
      },
      {
        title: 'Cloud-Native Developer Analytics & Error Monitoring Hub',
        difficulty: 'Advanced',
        description: 'SDK to capture client-side exceptions, parse sourcemaps, group error traces, and visualize health dashboards in real-time.',
        techStack: ['Next.js', 'TypeScript', 'ClickHouse / TimescaleDB', 'Tailwind CSS']
      }
    ]
  },

  'data-scientist': {
    roleTitle: 'Data Scientist & Analytics Engineer',
    industry: 'Data Science & Analytics',
    difficulty: 'Intermediate',
    estimatedTimeline: '6 - 9 Months',
    summary: 'Bridge business strategy, statistical rigor, data engineering pipelines (SQL/dbt), and predictive machine learning models.',
    phases: [
      {
        phaseNumber: 1,
        title: 'Advanced SQL & Data Wrangling',
        duration: 'Month 1 - 2',
        description: 'Master complex window functions, CTEs, query optimization, and exploratory data analysis in Python.',
        milestones: [
          {
            id: 'ds-m1',
            title: 'Advanced SQL Mastery for Analytics',
            description: 'Window functions (RANK, NTILE, LAG/LEAD), self-joins, query profiling, and dimensional modeling.',
            resources: ['Mode Analytics Advanced SQL Tutorial', 'SQL for Data Analysis (Cathy Tanimura)']
          },
          {
            id: 'ds-m2',
            title: 'Python for Data Analysis (Pandas & Polars)',
            description: 'Data transformation, handling missing data, time series aggregation, high-speed Polars dataframes.',
            resources: ['Data Analysis with Python (FreeCodeCamp)']
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Applied Statistics, A/B Testing & Modeling',
        duration: 'Month 3 - 4',
        description: 'Design statistically sound experiments, hypothesis tests, regression modeling, and classification systems.',
        milestones: [
          {
            id: 'ds-m3',
            title: 'Experimental Design & A/B Testing',
            description: 'Sample sizing, power calculations, p-values, Bonferroni corrections, variance reduction (CUPED).',
            resources: ['Trustworthy Online Controlled Experiments (Ron Kohavi)']
          },
          {
            id: 'ds-m4',
            title: 'Predictive Modeling & Scikit-Learn',
            description: 'Feature engineering, cross-validation, regularization (Ridge/Lasso), Random Forests, LightGBM, ROC-AUC.',
            resources: ['Hands-On Machine Learning with Scikit-Learn (Aurélien Géron)']
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Modern Analytics Stack & BI Visualization',
        duration: 'Month 5 - 6',
        description: 'Build production data pipelines with dbt and Snowflake, and craft executive dashboards in Tableau or Looker.',
        milestones: [
          {
            id: 'ds-m5',
            title: 'dbt (Data Build Tool) & Modern Warehouses',
            description: 'Data modeling, staging/marts layers, testing data quality, running dbt in CI/CD pipelines.',
            resources: ['dbt Learn Official Fundamentals Course']
          },
          {
            id: 'ds-m6',
            title: 'Executive Dashboards & Storytelling',
            description: 'Storytelling with data, KPI hierarchy, interactive Tableau/Looker dashboard creation.',
            resources: ['Storytelling with Data (Cole Nussbaumer Knaflic)']
          }
        ]
      }
    ],
    keyCertifications: [
      'Google Cloud Professional Data Engineer',
      'dbt Certified Developer',
      'AWS Certified Data Analytics - Specialty',
      'Databricks Certified Associate Developer for Apache Spark'
    ],
    recommendedProjects: [
      {
        title: 'Customer Churn Prediction & Retention Impact Engine',
        difficulty: 'Intermediate',
        description: 'End-to-end ML classification pipeline predicting subscriber churn with SHAP explainability and automated discount recommendations.',
        techStack: ['Python', 'XGBoost', 'SHAP', 'Streamlit', 'PostgreSQL']
      },
      {
        title: 'Full-Scale dbt Analytics Warehouse & Metric Store',
        difficulty: 'Intermediate',
        description: 'Model real-world transactional events into star-schema dimension tables with automated data quality tests and documentation.',
        techStack: ['dbt', 'Snowflake / DuckDB', 'SQL', 'Looker Studio']
      }
    ]
  },

  'cybersecurity-analyst': {
    roleTitle: 'Cybersecurity & Information Security Analyst',
    industry: 'Cyber Defense & Security',
    difficulty: 'Intermediate',
    estimatedTimeline: '6 - 9 Months',
    summary: 'Defend organizational networks, conduct threat hunting, configure SIEM dashboards, master penetration testing fundamentals, and enforce zero-trust security.',
    phases: [
      {
        phaseNumber: 1,
        title: 'Networking Fundamentals & OS Security',
        duration: 'Month 1 - 2',
        description: 'Master TCP/IP protocols, DNS/HTTP security, Linux administration, and network packet capture with Wireshark.',
        milestones: [
          {
            id: 'sec-m1',
            title: 'TCP/IP Protocols & Network Packet Analysis',
            description: 'OSI layers, subnets, routing, packet sniffing with Wireshark and tcpdump.',
            resources: ['Professor Messer Network+ Course', 'Practical Packet Analysis (Chris Sanders)']
          },
          {
            id: 'sec-m2',
            title: 'Linux Hardening & Command Line Defense',
            description: 'File permissions, SSH hardening, iptables/UFW firewalls, auditd, and bash scripting.',
            resources: ['Linux Basics for Hackers (OccupyTheWeb)']
          }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Threat Detection, SIEM & Incident Response',
        duration: 'Month 3 - 4',
        description: 'Analyze security telemetry logs, configure Splunk/Sentinel alerts, and triage malware incidents.',
        milestones: [
          {
            id: 'sec-m3',
            title: 'SIEM Operations & Threat Hunting (Splunk / ELK)',
            description: 'Querying event logs, writing correlation rules, detecting brute force and lateral movement.',
            resources: ['Splunk Free Training Courses', 'TryHackMe SOC Level 1 Pathway']
          },
          {
            id: 'sec-m4',
            title: 'Incident Handling & Forensics',
            description: 'Memory analysis (Volatility), disk imaging, reverse engineering basic malware artifacts.',
            resources: ['NIST Incident Handling Guide SP 800-61']
          }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Penetration Testing & Cloud Security',
        duration: 'Month 5 - 6',
        description: 'Learn OWASP Top 10 vulnerabilities, conduct ethical penetration testing with Kali Linux, and configure AWS/GCP cloud security.',
        milestones: [
          {
            id: 'sec-m5',
            title: 'Web Application Security (OWASP Top 10)',
            description: 'SQLi, XSS, CSRF, SSRF, broken access control testing with Burp Suite.',
            resources: ['PortSwigger Web Security Academy']
          },
          {
            id: 'sec-m6',
            title: 'Cloud Security Posture (AWS / Azure)',
            description: 'IAM least privilege, VPC peering, KMS encryption, CloudTrail auditing, zero-trust patterns.',
            resources: ['AWS Security Fundamentals']
          }
        ]
      }
    ],
    keyCertifications: [
      'CompTIA Security+ (SY0-701)',
      'Certified Ethical Hacker (CEH) / Practical Network Penetration Tester (PNPT)',
      'GIAC Certified Incident Handler (GCIH)',
      'AWS Certified Security - Specialty'
    ],
    recommendedProjects: [
      {
        title: 'Virtual SOC & Malware Analysis Honeypot Lab',
        difficulty: 'Intermediate',
        description: 'Deploy cloud honeypots (T-Pot/Cowrie), ingest attack telemetry into Splunk, and generate automated threat intelligence reports.',
        techStack: ['Linux', 'Docker', 'Splunk', 'Suricata IDS', 'Python']
      },
      {
        title: 'Automated Vulnerability Scanner & Alert Bot',
        difficulty: 'Intermediate',
        description: 'Python script auditing open ports, outdated SSL/TLS ciphers, and misconfigured S3 buckets with Slack webhook alerts.',
        techStack: ['Python', 'Nmap', 'Boto3 (AWS SDK)', 'Slack API']
      }
    ]
  }
};
