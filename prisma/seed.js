const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

// Mock job descriptions data
const mockJobDescriptions = [
  {
    // Tech Industry
    title: "Senior Full Stack Developer",
    company: "TechCorp Solutions",
    department: "Engineering",
    position: "Senior Engineer",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience_level: "Senior",
    salary_range: {
      min: 140000,
      max: 180000,
      currency: "USD",
    },
    required_skills: ["React", "Node.js", "TypeScript", "AWS"],
    preferred_skills: ["GraphQL", "Docker", "Kubernetes"],
    technical_requirements: "5+ years of experience in full-stack development",
    responsibilities:
      "Lead development of scalable web applications, mentor junior developers, collaborate with product teams",
    qualifications:
      "Bachelor's degree in Computer Science or related field, proven experience with modern web technologies",
    benefits:
      "Competitive salary, health insurance, 401k matching, unlimited PTO",
    description:
      "Join our engineering team to build next-generation web applications",
    work_scope: "Full-stack development, system architecture, team leadership",
    status: "Open",
    created_by: "admin@example.com",
  },
  {
    // Finance Industry
    title: "Financial Analyst",
    company: "Global Finance Corp",
    department: "Finance",
    position: "Senior Analyst",
    location: "New York, NY",
    job_type: "Full-time",
    experience_level: "Mid-Senior",
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
    created_by: "admin@example.com",
  },
  {
    // Healthcare Industry
    title: "Healthcare Data Scientist",
    company: "HealthTech Innovations",
    department: "Data Science",
    position: "Lead Data Scientist",
    location: "Boston, MA",
    job_type: "Full-time",
    experience_level: "Senior",
    salary_range: {
      min: 130000,
      max: 160000,
      currency: "USD",
    },
    required_skills: [
      "Python",
      "Machine Learning",
      "SQL",
      "Healthcare Analytics",
    ],
    preferred_skills: ["R", "HIPAA Compliance", "Electronic Health Records"],
    technical_requirements: "4+ years experience in healthcare data analysis",
    responsibilities:
      "Analyze patient data, develop predictive models, improve healthcare outcomes",
    qualifications:
      "Master's degree in Data Science or related field, healthcare experience preferred",
    benefits: "Medical benefits, research funding, conference attendance",
    description:
      "Use data science to improve patient care and healthcare operations",
    work_scope: "Healthcare analytics, machine learning, research",
    status: "Open",
    created_by: "admin@example.com",
  },
  {
    // Marketing Industry
    title: "Digital Marketing Manager",
    company: "Brand Builders Inc",
    department: "Marketing",
    position: "Marketing Manager",
    location: "Los Angeles, CA",
    job_type: "Full-time",
    experience_level: "Mid-Senior",
    salary_range: {
      min: 85000,
      max: 110000,
      currency: "USD",
    },
    required_skills: [
      "SEO",
      "Google Analytics",
      "Social Media Marketing",
      "Content Strategy",
    ],
    preferred_skills: [
      "Adobe Creative Suite",
      "Email Marketing",
      "Paid Advertising",
    ],
    technical_requirements: "5+ years of digital marketing experience",
    responsibilities:
      "Lead digital marketing campaigns, analyze performance metrics, manage team",
    qualifications:
      "Bachelor's degree in Marketing or related field, proven track record in digital marketing",
    benefits: "Performance bonuses, creative budget, flexible schedule",
    description:
      "Drive brand growth through innovative digital marketing strategies",
    work_scope: "Digital marketing, team management, strategy development",
    status: "Open",
    created_by: "admin@example.com",
  },
  {
    // Manufacturing Industry
    title: "Supply Chain Manager",
    company: "Industrial Manufacturing Co",
    department: "Operations",
    position: "Operations Manager",
    location: "Detroit, MI",
    job_type: "Full-time",
    experience_level: "Senior",
    salary_range: {
      min: 95000,
      max: 125000,
      currency: "USD",
    },
    required_skills: [
      "Supply Chain Management",
      "ERP Systems",
      "Lean Manufacturing",
      "Inventory Management",
    ],
    preferred_skills: ["Six Sigma", "SAP", "Project Management"],
    technical_requirements: "7+ years in manufacturing operations",
    responsibilities:
      "Optimize supply chain operations, manage vendor relationships, improve efficiency",
    qualifications:
      "Bachelor's degree in Supply Chain Management or related field, Six Sigma certification preferred",
    benefits:
      "Performance bonuses, relocation assistance, professional development",
    description:
      "Lead supply chain operations for a leading manufacturing company",
    work_scope:
      "Supply chain optimization, vendor management, process improvement",
    status: "Open",
    created_by: "admin@example.com",
  },
];

async function main() {
  try {
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

    // Create job descriptions
    const jobDescriptions = await Promise.all(
      mockJobDescriptions.map((job) =>
        prisma.jobDescriptions.create({
          data: {
            ...job,
            required_skills: JSON.stringify(job.required_skills),
            preferred_skills: JSON.stringify(job.preferred_skills),
          },
        })
      )
    );

    console.log("Seed data created successfully:");
    console.log("Roles:", roles);
    console.log(
      "Users:",
      users.map((user) => ({ email: user.email, username: user.username }))
    );
    console.log("Job Descriptions:", jobDescriptions);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
