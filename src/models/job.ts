import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

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
