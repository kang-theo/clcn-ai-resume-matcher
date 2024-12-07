const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

// Mock job descriptions data
const mockJobDescriptions = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    department: "Engineering",
    position: "Senior Engineer",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience_level: "Senior",
    skills: "React, Node.js, TypeScript, AWS, GraphQL, Docker, Kubernetes",
    salary_range: {
      min: 140000,
      max: 180000,
      currency: "USD",
    },
    required_skills: ["React", "Node.js", "TypeScript", "AWS"],
    preferred_skills: ["GraphQL", "Docker", "Kubernetes"],
    technical_requirements: "5+ years of experience in full-stack development",
    responsibilities:
      "Lead development of scalable web applications, mentor junior developers",
    qualifications: "Bachelor's degree in Computer Science or related field",
    benefits:
      "Competitive salary, health insurance, 401k matching, unlimited PTO",
    description:
      "Join our engineering team to build next-generation web applications",
    work_scope: "Full-stack development, system architecture, team leadership",
    status: "Open",
    created_by: "hr1@company.com",
    remote_policy: "Hybrid",
    visa_sponsorship: true,
    industry_sector: "Technology",
    company_size: "Enterprise",
    role_level: "Senior",
    cultural_keywords: JSON.stringify(["Innovative", "Fast-paced"]),
  },
  {
    title: "Financial Analyst",
    company: "Global Finance Corp",
    department: "Finance",
    position: "Senior Analyst",
    location: "New York, NY",
    job_type: "Full-time",
    experience_level: "Mid-Senior",
    skills:
      "Financial Modeling, Excel, SQL, Bloomberg Terminal, Python, R, Power BI",
    salary_range: {
      min: 90000,
      max: 120000,
      currency: "USD",
    },
    required_skills: [
      "Financial Modeling",
      "Excel",
      "SQL",
      "Bloomberg Terminal",
    ],
    preferred_skills: ["Python", "R", "Power BI"],
    technical_requirements: "3+ years of financial analysis experience",
    responsibilities:
      "Perform financial analysis, create reports, support investment decisions",
    qualifications: "Bachelor's degree in Finance or Economics, CFA preferred",
    benefits: "Annual bonus, health benefits, stock options",
    description:
      "Join a leading financial firm to analyze market trends and investment opportunities",
    work_scope: "Financial analysis, reporting, market research",
    status: "Open",
    created_by: "hr2@company.com", // Created by another HR
  },
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
    experiences: JSON.stringify([
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
    ]),
    technical_skills: JSON.stringify([
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
    ]),
    soft_skills: JSON.stringify([
      {
        skill: "Leadership",
        context: "Led team of 5 developers",
      },
      {
        skill: "Communication",
        context: "Regular client presentations",
      },
    ]),
    education: JSON.stringify([
      {
        institution: "University of California",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduation: "2016-05",
        gpa: 3.8,
        honors: ["Cum Laude"],
        relevant_courses: ["Data Structures", "Algorithms"],
      },
    ]),
    job_preferences: JSON.stringify({
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
    }),
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
    matching_skills: JSON.stringify(["React", "Node.js"]),
    missing_skills: JSON.stringify(["GraphQL"]),
    recommendations: "Consider learning GraphQL to improve job match.",
  },
];

// Add mock tags data
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
    // Clear existing data in the correct order (reverse of relationships)
    await prisma.tagsOnJobDescriptions.deleteMany({}); // Delete tag relations first
    await prisma.tags.deleteMany({}); // Delete tags
    await prisma.jobMatch.deleteMany({}); // Delete job matches
    await prisma.jobDescriptionAnalysis.deleteMany({}); // Delete analysis
    await prisma.applications.deleteMany({}); // Delete applications
    await prisma.questionairesOnJobDescriptions.deleteMany({}); // Delete questionnaire relations
    await prisma.jobDescriptions.deleteMany({}); // Now safe to delete job descriptions
    await prisma.onlineResumes.deleteMany({}); // Delete resumes
    await prisma.rolesOnUsers.deleteMany({}); // Delete role assignments
    await prisma.user.deleteMany({}); // Delete users
    await prisma.role.deleteMany({}); // Delete roles

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
      // Admin user
      prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
          email: "admin@example.com",
          username: "admin",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[0].id, // Admin role
              assigned_by: "admin@example.com",
            },
          },
        },
      }),

      // HR users
      prisma.user.upsert({
        where: { email: "hr1@company.com" },
        update: {},
        create: {
          email: "hr1@company.com",
          username: "hr_manager",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[1].id, // HR role
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
              role_id: roles[1].id, // HR role
              assigned_by: "admin@example.com",
            },
          },
        },
      }),

      // Regular users
      prisma.user.upsert({
        where: { email: "john.dev@example.com" },
        update: {},
        create: {
          email: "john.dev@example.com",
          username: "john_developer",
          password: hashedPassword,
          roles: {
            create: {
              role_id: roles[2].id, // User role
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
              role_id: roles[2].id, // User role
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
              role_id: roles[2].id, // User role
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

    // Clear existing job descriptions
    await prisma.jobDescriptions.deleteMany({});
    console.log("Cleared existing job descriptions");

    // Clear existing tags and tag relations
    await prisma.tagsOnJobDescriptions.deleteMany({});
    await prisma.tags.deleteMany({});

    // Create tags
    const tags = await Promise.all(
      mockTags.map((tag) =>
        prisma.tags.create({
          data: {
            name: tag.name,
          },
        })
      )
    );

    // Create job descriptions with tags
    const jobDescriptions = await Promise.all(
      mockJobDescriptions.map((job) =>
        prisma.jobDescriptions.create({
          data: {
            ...job,
            required_skills: JSON.stringify(job.required_skills),
            preferred_skills: JSON.stringify(job.preferred_skills),
            salary_range: JSON.stringify(job.salary_range),
            cultural_keywords: job.cultural_keywords,
            tags: {
              create: getTagsForJob(job, tags),
            },
          },
        })
      )
    );

    // Create online resumes (for john.dev@example.com)
    const johnUser = await prisma.user.findUnique({
      where: { email: "john.dev@example.com" },
    });

    const onlineResumes = await Promise.all(
      mockOnlineResumes.map((resume) =>
        prisma.onlineResumes.create({
          data: {
            ...resume,
            user_id: johnUser.id,
            visibility: "public", // Add any required fields
            completeness: 100, // Add any required fields
          },
        })
      )
    );

    // Create job matches
    const jobMatches = await Promise.all(
      mockJobMatches.map((match, index) =>
        prisma.jobMatch.create({
          data: {
            overall_match_score: match.overall_match_score,
            skill_match_score: match.skill_match_score,
            experience_match_score: match.experience_match_score,
            education_match_score: match.education_match_score,
            matching_skills: JSON.stringify(match.matching_skills),
            missing_skills: JSON.stringify(match.missing_skills),
            recommendations: match.recommendations,
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

// Helper function to determine which tags to assign to each job
function getTagsForJob(job, tags) {
  const tagAssignments = [];

  // Experience level tags
  if (job.experience_level?.toLowerCase().includes("senior")) {
    const seniorTag = tags.find((t) => t.name === "Senior Level");
    if (seniorTag) tagAssignments.push({ tag_id: seniorTag.id });
  } else if (job.experience_level?.toLowerCase().includes("mid")) {
    const midTag = tags.find((t) => t.name === "Mid Level");
    if (midTag) tagAssignments.push({ tag_id: midTag.id });
  }

  // Department/Field tags
  if (job.department?.toLowerCase().includes("engineering")) {
    const engineeringTag = tags.find((t) => t.name === "Engineering");
    if (engineeringTag) tagAssignments.push({ tag_id: engineeringTag.id });
  } else if (job.department?.toLowerCase().includes("finance")) {
    const financeTag = tags.find((t) => t.name === "Finance");
    if (financeTag) tagAssignments.push({ tag_id: financeTag.id });
  }

  // Job type specific tags
  if (job.title?.toLowerCase().includes("full stack")) {
    const fullStackTag = tags.find((t) => t.name === "Full Stack");
    if (fullStackTag) tagAssignments.push({ tag_id: fullStackTag.id });
  }

  // Industry tags
  if (job.company?.toLowerCase().includes("tech")) {
    const techTag = tags.find((t) => t.name === "Tech");
    if (techTag) tagAssignments.push({ tag_id: techTag.id });
  }

  return tagAssignments;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
