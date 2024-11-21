import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["AI_KEY"], // This is the default and can be omitted
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
        description: true,
        status: true,
        department: true,
        created_by: true,
        last_modifier: true,
        created_at: true,
        updated_at: true,
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
export async function createJob(payload: Omit<API.Job, "id">) {
  try {
    const job = await prisma.jobDescriptions.create({
      data: payload,
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
    return catchORMError("Failed to create job description", err);
  } finally {
    await prisma.$disconnect();
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

    if (job && resume) {
      // Call OpenAI API to analyze resume
      // const analysisResponse = await openai.createCompletion({
      //   model: "text-davinci-003",
      //   prompt: `Analyze the following resume against the job description:\n\nJob Description: ${job.description}\n\nResume Content: ${resumePath}`,
      //   max_tokens: 150,
      // });

      const chatCompletion: OpenAI.Chat.ChatCompletion =
        await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Analyze the following resume against the job description:\n\nJob Description: ${job.description}\n\n and Job required skills: ${job.skills} \n\n Resume Content: ${resume.content}. The scoring mechanism is one to ten, the ten is full score, how many score do you decide? `,
            },
          ],
        });

      const analysisText = chatCompletion.choices[0].message?.content;

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
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to analyze job description", err);
  }
}
