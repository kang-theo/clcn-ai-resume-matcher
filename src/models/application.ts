import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllApplications({
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
}: ITableParams) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.applications.findMany({
      where: search,
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        last_modifier: true,
        status: true,
        scores: true,
        user: {
          select: {
            email: true,
          },
        },
        online_resume: {
          select: {
            id: true,
            // content: true,
          },
        },
        job_description: {
          select: {
            id: true,
            title: true,
            company: true,
            position: true,
            status: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.applications.count();
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
    return catchORMError("Failed to get applications", err);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * User applies for a job
 * @type {string[]}
 */
export async function createApplication({
  user_id,
  online_resume_id,
  job_description_id,
  scores = 0,
}: {
  user_id: string;
  online_resume_id: string;
  job_description_id: string;
  scores?: number;
}) {
  try {
    const newApplication = await prisma.applications.create({
      data: { user_id, online_resume_id, job_description_id, scores },
    });

    if (newApplication) {
      return {
        meta: {
          code: "OK",
        },
        data: newApplication,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to create application", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteApplications(ids: string[]) {
  try {
    const deleteApplications = await prisma.applications.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (deleteApplications.count === ids.length) {
      return {
        meta: {
          code: "OK",
        },
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to delete applications", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getApplication(applicationId: string) {
  try {
    const application = await prisma.applications.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (application) {
      return {
        meta: {
          code: "OK",
        },
        data: application,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get application", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateApplication(
  applicationId: string,
  payload: { status: "pending" | "approved" | "rejected" },
  operator: string
) {
  try {
    const application = await prisma.applications.update({
      where: {
        id: applicationId,
      },
      data: payload,
    });

    if (application) {
      return {
        meta: {
          code: "OK",
        },
        data: application,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update application", err);
  } finally {
    await prisma.$disconnect();
  }
}
