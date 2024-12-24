import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_KEY, // This is the default and can be omitted
});

export async function listAllJobs({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.jobDescriptions.findMany({
      where: search,
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        status: true,
        department: true,
        created_by: true,
        last_modifier: true,
        created_at: true,
        updated_at: true,
        salary_range: true,
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.jobDescriptions.count({ where: search });
    // const totalPages = Math.ceil(total / pageSize);
    return {
      meta: {
        code: "OK",
      },
      data: {
        records,
        total,
        // totalPages,
        pagination: {
          total,
          pageSize,
          page,
        },
      },
    };
  } catch (err) {
    return catchORMError("Failed to get job descriptions", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function listAllJobsByStatus(
  { page, pageSize, search, sortField, sortOrder }: ITableParams,
  userId: string,
  isAdmin: boolean
) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.jobDescriptions.findMany({
      where: search,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        job_type: true,
        description: true,
        status: true,
        department: true,
        created_by: true,
        last_modifier: true,
        created_at: true,
        updated_at: true,
        salary_range: true,
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        applications: true,
        // job_matches: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.jobDescriptions.count({ where: search });
    // const totalPages = Math.ceil(total / pageSize);
    return {
      meta: {
        code: "OK",
      },
      data: {
        records,
        total,
        // totalPages,
        pagination: {
          total,
          pageSize,
          page,
        },
      },
    };
  } catch (err) {
    return catchORMError("Failed to get job descriptions", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Pick etc
export async function createJob(data: API.JobPayload): Promise<API.ModelRes> {
  try {
    const job = await prisma.jobDescriptions.create({
      data: {
        title: data.title,
        description: data.description,
        job_type: data.job_type,
        experience_level: data.experience_level,
        remote_policy: data.remote_policy,
        created_by: data.created_by,
        // Company details nested
        company: data.company,
        location: data.company.location,
        // company_name: data.company.name,
        // company_location: data.company.location,
        // company_website: data.company.website,
        // company_about: data.company.about,
        // company_size: data.company.size,
        // company_industry: data.company.industry,
        // Salary range nested
        salary_range: data.salary_range,
        // salary_min: data.salary_range.min,
        // salary_max: data.salary_range.max,
        // salary_currency: data.salary_range.currency,
        // Additional fields
        responsibilities: data.responsibilities,
        qualifications: data.qualifications,
        required_skills: data.required_skills,
        preferred_skills: data.preferred_skills,
        skills: data.skills,
        industry_sector: data.industry_sector,
        status: "Draft", // Default status
      },
    });

    return {
      meta: { code: "OK" },
      data: job,
    };
  } catch (error: any) {
    return {
      meta: {
        code: "ERROR",
        message: error.message,
      },
    };
  }
}

export async function deleteJobs(ids: string[]) {
  try {
    const deleteJobs = await prisma.jobDescriptions.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (deleteJobs.count === ids.length) {
      return {
        meta: {
          code: "OK",
        },
      };
    }
    return {
      meta: {
        code: "ERROR",
      },
    };
  } catch (err) {
    return catchORMError("Failed to delete job descriptions", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getJob(id: string) {
  try {
    const job = await prisma.jobDescriptions.findUnique({
      where: {
        id,
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                // color: true,
              },
            },
          },
        },
      },
    });

    if (job) {
      return {
        meta: {
          code: "OK",
        },
        data: job,
      };
    }
    return {
      meta: {
        code: "ERROR",
      },
    };
  } catch (err) {
    return catchORMError("Failed to get job description", err);
  }
}

export async function analyzeJob({
  id,
  user_id,
}: {
  id: string;
  user_id: string;
}) {
  try {
    // step 1: get the job description
    const job = await prisma.jobDescriptions.findUnique({
      where: {
        id,
      },
    });

    // step 2: use openai to analyze the job description
    const resume = await prisma.onlineResumes.findFirst({
      where: {
        user_id,
      },
    });

    if (!resume) {
      return {
        meta: {
          code: "ERROR",
          message: "No resume found",
        },
      };
    }

    if (job) {
      // Call OpenAI API to analyze resume
      // const analysisResponse = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: `Analyze the following resume against the job description:\n\nJob Description: ${job.description}\n\nResume Content: ${resumePath}`,
      //   max_tokens: 150,
      // });

      // const chatCompletion: OpenAI.Chat.ChatCompletion =
      //   await client.chat.completions.create({
      //     model: "gpt-3.5-turbo",
      //     messages: [
      //       {
      //         role: "user",
      //         content: `Analyze the following resume against the job description:\n\nJob Description: ${
      //           job.description
      //         }\n\n and Job required skills: ${
      //           job.skills
      //         } \n\n Resume Content: ${JSON.stringify(
      //           resume.content,
      //           null,
      //           2
      //         )}}\n\n and user masters skills. By the way, ignore the resume content's HTML tag. The scoring mechanism is one to ten, the ten is full score, how many score do you decide? `,
      //       },
      //     ],
      //   });

      // const analysisText = chatCompletion.choices[0].message?.content;
      const analysisText = await analyzeJobMatch(job, resume);

      // Implement your scoring mechanism here
      // Placeholder for actual scoring logic
      // const score = Math.random() * 100;

      return {
        meta: {
          code: "OK",
        },
        data: {
          analysisText,
        },
      };
    } else {
      return {
        meta: {
          code: "ERROR",
          message: "Job not found",
        },
      };
    }
  } catch (err) {
    console.log(err);
    return catchORMError("Failed to analyze job description", err);
  }
}

export async function updateJob(jobId: string, job: Omit<API.Job, "id">) {
  try {
    const updatedJob = await prisma.jobDescriptions.update({
      where: { id: jobId },
      data: { ...job },
    });

    if (updatedJob) {
      return {
        meta: {
          code: "OK",
        },
        data: {
          job: updatedJob,
        },
      };
    } else {
      return {
        meta: {
          code: 400,
          message: "Failed to update job",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update job", err);
  }
}

async function analyzeJobMatch(jobDescription: any, resume: any) {
  const matchAnalysisPrompt = `
You are an expert AI recruitment analyst. Analyze the job description and resume data provided below to determine compatibility and generate matching scores.

Job Description:
{
  "title": "${jobDescription.title}",
  "required_skills": ${jobDescription.required_skills},
  "preferred_skills": ${jobDescription.preferred_skills},
  "experience_level": "${jobDescription.experience_level}",
  "technical_requirements": "${jobDescription.technical_requirements}",
  "responsibilities": "${jobDescription.responsibilities}",
  "qualifications": "${jobDescription.qualifications}"
}

Candidate Resume:
{
  "title": "${resume.title}",
  "summary": "${resume.summary}",
  "technical_skills": ${resume.technical_skills},
  "experiences": ${resume.experiences},
  "education": ${resume.education},
  "certifications": ${resume.certifications},
  "projects": ${resume.projects},
  "languages": ${resume.languages},
  "soft_skills": ${resume.soft_skills},
  "job_preferences": ${resume.job_preferences},
  "ai_analysis": ${resume.ai_analysis}
}

Please analyze and provide a structured evaluation with the following:

1. Skills Match Analysis:
   - Calculate percentage match of required skills
   - Calculate percentage match of preferred skills
   - Identify key missing skills
   - Skills match score (0-100)

2. Experience Match Analysis:
   - Evaluate relevance of past experiences
   - Compare experience level requirements
   - Experience match score (0-100)

3. Education & Qualifications Match:
   - Evaluate educational background against requirements
   - Consider relevant certifications
   - Education match score (0-100)

4. Overall Compatibility:
   - Calculate weighted overall match score (0-100)
   - Provide brief explanation of score
   - List top 3 strengths
   - List top 3 areas for improvement

Please return the analysis in the following JSON format:
{
  "skill_match_score": number,
  "experience_match_score": number,
  "education_match_score": number,
  "overall_match_score": number,
  "matching_skills": string[],
  "missing_skills": string[],
  "recommendations": string,
  "analysis_summary": string
}
`;

  const response: OpenAI.Chat.ChatCompletion =
    await client.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI recruitment analyst specializing in job matching analysis.",
        },
        {
          role: "user",
          content: matchAnalysisPrompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

  const analysis = JSON.parse(response.choices[0].message.content || "{}");

  // Save the match analysis
  await prisma.jobMatch.create({
    data: {
      job_description_id: jobDescription.id,
      online_resume_id: resume.id,
      overall_match_score: analysis.overall_match_score,
      skill_match_score: analysis.skill_match_score,
      experience_match_score: analysis.experience_match_score,
      education_match_score: analysis.education_match_score,
      matching_skills: analysis.matching_skills,
      missing_skills: analysis.missing_skills,
      recommendations: analysis.recommendations,
    },
  });

  return analysis;
}
