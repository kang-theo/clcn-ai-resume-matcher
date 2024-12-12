const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

// Mock job descriptions data
const mockJobDescriptions = [
  {
    title: "Senior Full Stack Developer",
    company: {
      name: "TechCorp Solutions",
      logo: "/company-logos/techcorp.png",
      about:
        "TechCorp Solutions is a leading software development company specializing in enterprise solutions...",
      size: "501-1000 employees",
      industry: "Technology",
      website: "https://techcorp.example.com",
      location: "San Francisco, CA",
    },
    department: "Engineering",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience_level: "Senior",
    skills: "React, Node.js, TypeScript, AWS, REST APIs, SQL, MongoDB",
    required_skills: ["React", "Node.js", "TypeScript", "AWS"],
    preferred_skills: ["GraphQL", "Docker", "Kubernetes"],
    salary_range: {
      min: 140000,
      max: 180000,
      currency: "USD",
    },
    description:
      "Join our engineering team to build next-generation web applications...",
    responsibilities:
      "Lead development of scalable web applications, mentor junior developers...",
    qualifications:
      "Bachelor's degree in Computer Science or related field, 5+ years of experience in full-stack development",
    status: "Open",
    industry_sector: "Technology",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Investment Banking Analyst",
    company: {
      name: "Goldman Financial",
      logo: "/company-logos/goldman.png",
      about:
        "Goldman Financial is a global investment banking firm with a rich history...",
      size: "10000+ employees",
      industry: "Finance",
      website: "https://goldman.example.com",
      location: "New York, NY",
    },
    department: "Investment Banking",
    location: "New York, NY",
    job_type: "Full-time",
    experience_level: "Entry Level",
    skills:
      "Financial Modeling, Excel, PowerPoint, SQL, Financial Analysis, Valuation",
    required_skills: ["Financial Modeling", "Excel", "PowerPoint", "SQL"],
    preferred_skills: ["Bloomberg Terminal", "Python", "VBA"],
    salary_range: {
      min: 95000,
      max: 125000,
      currency: "USD",
    },
    description:
      "Join our investment banking team to support M&A transactions and financial analysis.",
    responsibilities:
      "Conduct financial analysis, prepare client presentations, support deal execution",
    qualifications:
      "Bachelor's degree in Finance, Economics, or related field, Strong analytical and quantitative skills, Excellent attention to detail",
    status: "Open",
    industry_sector: "Finance",
    remote_policy: "On-site",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Clinical Research Coordinator",
    company: {
      name: "BioHealth Research",
      logo: "/company-logos/biohealth.png",
      about:
        "BioHealth Research is at the forefront of clinical trials and medical research...",
      size: "201-500 employees",
      industry: "Healthcare",
      website: "https://biohealth.example.com",
      location: "Boston, MA",
    },
    department: "Clinical Operations",
    location: "Boston, MA",
    job_type: "Full-time",
    experience_level: "Mid Level",
    skills: "Clinical Trial Management, GCP, HIPAA, Data Collection",
    required_skills: [
      "Clinical Trial Management",
      "GCP",
      "HIPAA",
      "Data Collection",
    ],
    preferred_skills: ["REDCap", "CTMS", "Medical Terminology"],
    salary_range: {
      min: 65000,
      max: 85000,
      currency: "USD",
    },
    description:
      "Coordinate clinical trials and ensure compliance with protocols and regulations.",
    responsibilities:
      "Manage clinical trials, coordinate with research teams, ensure regulatory compliance",
    qualifications:
      "Bachelor's degree in Life Sciences or related field, 3+ years of experience in clinical research",
    status: "Open",
    industry_sector: "Healthcare",
    remote_policy: "On-site",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Marketing Manager",
    company: {
      name: "Consumer Brands Co",
      logo: "/company-logos/consumerbrands.png",
      about:
        "Consumer Brands Co is a leader in the consumer goods industry, known for its innovative products...",
      size: "1001-5000 employees",
      industry: "Consumer Goods",
      website: "https://consumerbrands.example.com",
      location: "Chicago, IL",
    },
    department: "Marketing",
    location: "Chicago, IL",
    job_type: "Full-time",
    experience_level: "Senior",
    skills:
      "Digital Marketing, Brand Management, Analytics, Campaign Management",
    required_skills: [
      "Digital Marketing",
      "Brand Management",
      "Analytics",
      "Campaign Management",
    ],
    preferred_skills: [
      "Adobe Creative Suite",
      "Google Analytics",
      "Social Media Management",
    ],
    salary_range: {
      min: 90000,
      max: 120000,
      currency: "USD",
    },
    description:
      "Lead marketing initiatives for our consumer products division.",
    responsibilities:
      "Develop marketing strategies, manage campaigns, analyze performance metrics",
    qualifications:
      "Bachelor's degree in Marketing or related field, 5+ years of experience in marketing management",
    status: "Open",
    industry_sector: "Consumer Goods",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Environmental Engineer",
    company: {
      name: "GreenTech Solutions",
      logo: "/company-logos/greentech.png",
      about:
        "GreenTech Solutions is committed to sustainable engineering and environmental solutions...",
      size: "501-1000 employees",
      industry: "Environmental",
      website: "https://greentech.example.com",
      location: "Seattle, WA",
    },
    department: "Engineering",
    location: "Seattle, WA",
    job_type: "Full-time",
    experience_level: "Mid Level",
    skills:
      "Environmental Impact Assessment, AutoCAD, Waste Management, Regulatory Compliance",
    required_skills: [
      "Environmental Impact Assessment",
      "AutoCAD",
      "Waste Management",
      "Regulatory Compliance",
    ],
    preferred_skills: ["GIS", "Environmental Modeling"],
    salary_range: {
      min: 75000,
      max: 95000,
      currency: "USD",
    },
    description:
      "Work on projects that focus on environmental sustainability and compliance.",
    responsibilities:
      "Conduct environmental assessments, design sustainable solutions, ensure regulatory compliance",
    qualifications:
      "Bachelor's degree in Environmental Engineering or related field, 3+ years of experience in environmental engineering",
    status: "Open",
    industry_sector: "Environmental",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Data Scientist",
    company: {
      name: "Data Insights Inc",
      logo: "/company-logos/datainsights.png",
      about:
        "Data Insights Inc provides cutting-edge data analytics solutions to businesses worldwide...",
      size: "201-500 employees",
      industry: "Data Science",
      website: "https://datainsights.example.com",
      location: "Austin, TX",
    },
    department: "Data Science",
    location: "Austin, TX",
    job_type: "Full-time",
    experience_level: "Senior",
    skills: "Python, R, Machine Learning, Data Visualization, SQL",
    required_skills: [
      "Python",
      "Machine Learning",
      "Data Visualization",
      "SQL",
    ],
    preferred_skills: ["R", "Deep Learning", "Big Data Technologies"],
    salary_range: {
      min: 110000,
      max: 140000,
      currency: "USD",
    },
    description:
      "Analyze complex datasets to drive business insights and strategy.",
    responsibilities:
      "Develop machine learning models, create data visualizations, collaborate with cross-functional teams",
    qualifications:
      "Master's degree in Data Science or related field, 5+ years of experience in data analysis",
    status: "Open",
    industry_sector: "Data Science",
    remote_policy: "Remote",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Construction Project Manager",
    company: {
      name: "BuildIt Construction",
      logo: "/company-logos/buildit.png",
      about:
        "BuildIt Construction is a leading construction company known for its innovative projects...",
      size: "1001-5000 employees",
      industry: "Construction",
      website: "https://buildit.example.com",
      location: "Denver, CO",
    },
    department: "Project Management",
    location: "Denver, CO",
    job_type: "Full-time",
    experience_level: "Senior",
    skills:
      "Project Management, Construction Management, Budgeting, Scheduling",
    required_skills: [
      "Project Management",
      "Construction Management",
      "Budgeting",
      "Scheduling",
    ],
    preferred_skills: ["AutoCAD", "MS Project", "Risk Management"],
    salary_range: {
      min: 95000,
      max: 125000,
      currency: "USD",
    },
    description: "Oversee construction projects from inception to completion.",
    responsibilities:
      "Manage project timelines, budgets, and resources, ensure compliance with safety regulations",
    qualifications:
      "Bachelor's degree in Construction Management or related field, 7+ years of experience in project management",
    status: "Open",
    industry_sector: "Construction",
    remote_policy: "On-site",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "UX Designer",
    company: {
      name: "Creative Designs Studio",
      logo: "/company-logos/creativedesigns.png",
      about:
        "Creative Designs Studio is a top design firm specializing in user experience and interface design...",
      size: "51-200 employees",
      industry: "Design",
      website: "https://creativedesigns.example.com",
      location: "Los Angeles, CA",
    },
    department: "Design",
    location: "Los Angeles, CA",
    job_type: "Full-time",
    experience_level: "Mid Level",
    skills: "UX Design, Wireframing, Prototyping, User Research",
    required_skills: [
      "UX Design",
      "Wireframing",
      "Prototyping",
      "User Research",
    ],
    preferred_skills: ["Adobe XD", "Sketch", "Figma"],
    salary_range: {
      min: 70000,
      max: 90000,
      currency: "USD",
    },
    description:
      "Design user-friendly interfaces for our consumer products division.",
    responsibilities:
      "Develop user experience strategies, create wireframes and prototypes, conduct user research",
    qualifications:
      "Bachelor's degree in Design or related field, 3+ years of experience in UX design",
    status: "Open",
    industry_sector: "Design",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Senior Full Stack Engineer",
    company: {
      name: "Innovation Labs",
      logo: "/company-logos/innovationlabs.png",
      about:
        "Innovation Labs is a cutting-edge tech company focused on building scalable enterprise solutions...",
      size: "201-500 employees",
      industry: "Technology",
      website: "https://innovationlabs.example.com",
      location: "San Francisco, CA",
    },
    department: "Engineering",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience_level: "Senior",
    skills: "React, Node.js, TypeScript, AWS, Docker, Microservices",
    required_skills: ["React", "Node.js", "AWS", "TypeScript"],
    preferred_skills: ["Docker", "Kubernetes", "GraphQL"],
    salary_range: {
      min: 150000,
      max: 190000,
      currency: "USD",
    },
    description:
      "Join our engineering team to build scalable microservices and lead development initiatives.",
    responsibilities:
      "Lead development teams, architect solutions, mentor junior developers, implement best practices",
    qualifications:
      "Bachelor's degree in Computer Science or related field, 5+ years of full-stack development experience",
    status: "Open",
    industry_sector: "Technology",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  {
    title: "Lead Software Engineer",
    company: {
      name: "FutureTech Systems",
      logo: "/company-logos/futuretech.png",
      about:
        "FutureTech Systems specializes in building enterprise-grade cloud solutions with a focus on scalability and innovation...",
      size: "501-1000 employees",
      industry: "Technology",
      website: "https://futuretech.example.com",
      location: "San Francisco, CA",
    },
    department: "Engineering",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience_level: "Senior",
    skills:
      "React, Node.js, TypeScript, AWS, Microservices Architecture, Team Leadership",
    required_skills: ["React", "Node.js", "AWS", "Team Leadership"],
    preferred_skills: ["TypeScript", "Docker", "System Design"],
    salary_range: {
      min: 160000,
      max: 200000,
      currency: "USD",
    },
    description:
      "Looking for an experienced technical leader to drive our core platform development and mentor our engineering team.",
    responsibilities:
      "Lead a team of full-stack developers, architect cloud-native solutions, establish technical standards, and drive innovation",
    qualifications:
      "BS in Computer Science or related field, 7+ years of full-stack development, proven leadership experience",
    status: "Open",
    industry_sector: "Technology",
    remote_policy: "Hybrid",
    created_by: "hr1@company.com",
    cultural_keywords: null,
  },
  // ... other job descriptions
];

// Mock online resumes data
const mockOnlineResumes = [
  {
    title: "Senior Software Engineer",
    summary: "Experienced full-stack developer with 8 years in web development",
    headline: "Full Stack Developer | React | Node.js | AWS",
    current_status: "Actively looking",
    location: "San Francisco, CA",
    relocation: true,
    remote_preference: "Hybrid",
    experiences: [
      {
        company: "Tech Innovators Inc",
        position: "Senior Software Engineer",
        department: "Engineering",
        location: "San Francisco, CA",
        employment_type: "Full-time",
        duration: {
          start: "2020-01",
          end: null,
          is_current: true,
        },
        responsibilities: [
          "Led development of microservices architecture",
          "Mentored junior developers",
        ],
        achievements: [
          "Reduced deployment time by 50%",
          "Improved application performance by 30%",
        ],
        technologies: ["React", "Node.js", "AWS", "Docker"],
      },
    ],
    technical_skills: [
      {
        skill: "React",
        proficiency: "Expert",
        years_experience: 5,
        last_used: "2024-03",
      },
      {
        skill: "Node.js",
        proficiency: "Advanced",
        years_experience: 4,
        last_used: "2024-03",
      },
    ],
    soft_skills: [
      {
        skill: "Leadership",
        context: "Led team of 5 developers",
      },
      {
        skill: "Communication",
        context: "Regular client presentations",
      },
    ],
    education: [
      {
        institution: "University of California",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduation: "2016-05",
        gpa: 3.8,
        honors: ["Cum Laude"],
        relevant_courses: ["Data Structures", "Algorithms"],
      },
    ],
    job_preferences: {
      desired_role_level: ["Senior", "Lead"],
      preferred_industries: ["Technology", "Finance"],
      job_types: ["Full-time"],
      preferred_locations: ["San Francisco", "Remote"],
      salary_expectations: {
        min: 150000,
        max: 200000,
        currency: "USD",
      },
      notice_period: "2 weeks",
    },
    skills_searchable:
      "React Node.js TypeScript AWS Docker Kubernetes Leadership",
    visibility: "public",
    completeness: 100,
  },
];

// Mock job match data
const mockJobMatches = [
  {
    overall_match_score: 85,
    skill_match_score: 90,
    experience_match_score: 80,
    education_match_score: 88,
    matching_skills: ["React", "Node.js"],
    missing_skills: ["GraphQL"],
    recommendations: "Consider learning GraphQL to improve job match.",
  },
  // ... other job matches
];

// Mock tags data
const mockTags = [
  { name: "Remote" },
  { name: "Senior Level" },
  { name: "Engineering" },
  { name: "Full Stack" },
  { name: "Finance" },
  { name: "Analytics" },
  { name: "Entry Level" },
  { name: "Mid Level" },
  { name: "Tech" },
  { name: "Healthcare" },
];

async function main() {
  try {
    // Clear existing data
    await prisma.tagsOnJobDescriptions.deleteMany({});
    await prisma.tags.deleteMany({});
    await prisma.jobMatch.deleteMany({});
    await prisma.jobDescriptionAnalysis.deleteMany({});
    await prisma.applications.deleteMany({});
    await prisma.questionairesOnJobDescriptions.deleteMany({});
    await prisma.jobDescriptions.deleteMany({});
    await prisma.onlineResumes.deleteMany({});
    await prisma.rolesOnUsers.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});

    console.log("Cleared existing data");

    // Create roles
    const roles = await Promise.all([
      prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: {
          name: "Admin",
          description: "Administrator role with full access",
          created_by: "admin@example.com",
        },
      }),
      prisma.role.upsert({
        where: { name: "HR" },
        update: {},
        create: {
          name: "HR",
          description: "Human Resources role",
          created_by: "admin@example.com",
        },
      }),
      prisma.role.upsert({
        where: { name: "User" },
        update: {},
        create: {
          name: "User",
          description: "Regular user role",
          created_by: "admin@example.com",
        },
      }),
    ]);

    // Create users with different roles
    const hashedPassword = await hash("Password@123", 12);

    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
          email: "admin@example.com",
          username: "admin",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[0].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
      prisma.user.upsert({
        where: { email: "hr1@company.com" },
        update: {},
        create: {
          email: "hr1@company.com",
          username: "hr_manager",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[1].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
      prisma.user.upsert({
        where: { email: "hr2@company.com" },
        update: {},
        create: {
          email: "hr2@company.com",
          username: "hr_recruiter",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[1].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
      prisma.user.upsert({
        where: { email: "john.dev@example.com" },
        update: {},
        create: {
          email: "john.dev@example.com",
          username: "john_developer",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[2].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
      prisma.user.upsert({
        where: { email: "sarah.analyst@example.com" },
        update: {},
        create: {
          email: "sarah.analyst@example.com",
          username: "sarah_analyst",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[2].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
      prisma.user.upsert({
        where: { email: "mike.designer@example.com" },
        update: {},
        create: {
          email: "mike.designer@example.com",
          username: "mike_designer",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[2].id,
              assigned_by: "admin@example.com",
            },
          },
        },
      }),
    ]);

    console.log("Seed users created successfully:");
    console.log(
      "Users:",
      users.map((user) => ({ email: user.email, username: user.username }))
    );

    // First create the tags
    const tags = await Promise.all(
      mockTags.map((tag) =>
        prisma.tags.create({
          data: {
            name: tag.name,
          },
        })
      )
    );

    console.log("Created tags:", tags);

    // Then create job descriptions with the created tag IDs
    const jobDescriptions = await Promise.all(
      mockJobDescriptions.map((job) =>
        prisma.jobDescriptions.create({
          data: {
            ...job,
            tags: {
              create: getTagsForJob(job, tags),
            },
          },
        })
      )
    );

    // Create online resumes
    const johnUser = await prisma.user.findUnique({
      where: { email: "john.dev@example.com" },
    });

    const onlineResumes = await Promise.all(
      mockOnlineResumes.map((resume) =>
        prisma.onlineResumes.create({
          data: {
            ...resume,
            user_id: johnUser.id,
          },
        })
      )
    );

    // Create job matches
    const jobMatches = await Promise.all(
      mockJobMatches.map((match, index) =>
        prisma.jobMatch.create({
          data: {
            ...match,
            job_description_id:
              jobDescriptions[index % jobDescriptions.length].id,
            online_resume_id: onlineResumes[0].id,
          },
        })
      )
    );

    console.log(
      `Created or updated ${jobDescriptions.length} job descriptions`
    );
    console.log(`Created or updated ${onlineResumes.length} online resumes`);
    console.log(`Created or updated ${jobMatches.length} job matches`);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Update the getTagsForJob function
const getTagsForJob = (job, allTags) => {
  const tags = [];
  const lowercaseTitle = job.title.toLowerCase();
  const lowercaseCompany = job.company.name.toLowerCase();
  const lowercaseIndustry = job.industry_sector.toLowerCase();
  const lowercaseExperience = job.experience_level.toLowerCase();

  allTags.forEach((tag) => {
    const lowercaseTag = tag.name.toLowerCase();
    if (
      lowercaseTitle.includes(lowercaseTag) ||
      lowercaseCompany.includes(lowercaseTag) ||
      lowercaseIndustry.includes(lowercaseTag) ||
      lowercaseExperience.includes(lowercaseTag)
    ) {
      tags.push({ tag_id: tag.id });
    }
  });

  return tags;
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
