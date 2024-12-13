import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllApplications({
  status,
  page,
  pageSize,
  search,
  sortField,
  sortOrder,
  currentUser,
}: ITableParams & {
  status: "pending" | "approved" | "rejected";
  currentUser: { email: string; id: string; roles: string[] };
}) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let whereClause: any = status ? { status, ...search } : { ...search };

    const isAdmin = currentUser.roles.includes("Admin");
    const isHR = currentUser.roles.includes("HR");

    if (!isAdmin) {
      if (isHR) {
        // HR can only see applications of they created job descriptions
        whereClause = {
          ...whereClause,
          job_description: {
            created_by: currentUser.email,
          },
        };
      } else {
        // normal user only see their applied applications
        whereClause = {
          ...whereClause,
          user_id: currentUser.id,
        };
      }
    }

    const records = await prisma.applications.findMany({
      where: whereClause,
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        last_modifier: true,
        status: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        online_resume: {
          select: {
            id: true,
            title: true,
            summary: true,
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
            salary_range: true,
          },
        },
        job_match: true,
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip,
      take,
    });

    const total = await prisma.applications.count({
      where: whereClause,
    });

    return {
      meta: {
        code: "OK",
      },
      data: {
        records,
        total,
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
  job_description_id,
}: {
  user_id: string;
  job_description_id: string;
}) {
  try {
    // Check if user has already applied
    const existingApplication = await prisma.applications.findFirst({
      where: {
        job_description_id,
        user_id,
      },
    });

    if (existingApplication) {
      return {
        meta: {
          code: "ERROR",
          message: "You have already applied for this job",
        },
      };
    }

    // Find user's first online resume
    const userResume = await prisma.onlineResumes.findFirst({
      where: {
        user_id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!userResume) {
      return {
        meta: {
          code: "ERROR",
          message: "No resume found. Please create a resume first.",
        },
      };
    }

    // Get job match record if exists
    const jobMatch = await prisma.jobMatch.findFirst({
      where: {
        job_description_id,
        online_resume_id: userResume.id,
      },
    });

    // Create new application
    const application = await prisma.applications.create({
      data: {
        user_id,
        job_description_id,
        online_resume_id: userResume.id,
        scores: jobMatch?.overall_match_score ?? 0,
        status: "pending",
        job_match_id: jobMatch?.id,
      },
    });

    if (application) {
      return {
        meta: {
          code: "OK",
          message: "Application submitted successfully",
        },
        data: application,
      };
    } else {
      return {
        meta: {
          code: "ERROR",
          message: "Failed to apply this job. Please contact the support.",
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
