import { catchORMError } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ITableParams } from "@/lib/interfaces";

export async function listAllOnlineResumes(
  { page, pageSize, search, sortField, sortOrder }: ITableParams,
  userId?: string | undefined
) {
  try {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const records = await prisma.onlineResumes.findMany({
      where: {
        ...search,
        user_id: userId,
      },
      select: {
        id: true,
        user_id: true,
        title: true,
        summary: true,
        headline: true,
        current_status: true,
        location: true,
        relocation: true,
        remote_preference: true,
        experiences: true,
        technical_skills: true,
        soft_skills: true,
        education: true,
        certifications: true,
        job_preferences: true,
        projects: true,
        languages: true,
        ai_analysis: true,
        visibility: true,
        completeness: true,
        last_updated: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: skip,
      take: take,
    });

    const total = await prisma.onlineResumes.count({
      where: {
        ...search,
        user_id: userId,
      },
    });
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
    return catchORMError("Failed to get online resumes", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function createOnlineResume({
  user_id,
  content,
}: {
  user_id: string;
  content: Record<string, any>;
}) {
  try {
    const onlineResume = await prisma.onlineResumes.create({
      data: {
        user_id,
        content,
      },
    });

    if (onlineResume) {
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
    return catchORMError("Failed to create online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getResume(id: string) {
  try {
    const resume = await prisma.onlineResumes.findUnique({
      where: {
        id,
      },
    });

    if (resume) {
      return {
        meta: {
          code: "OK",
        },
        data: resume,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to get online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateResume({
  id,
  content,
}: {
  id: string;
  content: Record<string, any>;
}) {
  try {
    const onlineResume = await prisma.onlineResumes.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    if (onlineResume) {
      return {
        meta: {
          code: "OK",
        },
        data: onlineResume,
      };
    } else {
      return {
        meta: {
          code: "400",
        },
      };
    }
  } catch (err) {
    return catchORMError("Failed to update online resume", err);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteResume(id: string) {
  try {
    const resume = await prisma.onlineResumes.delete({
      where: {
        id,
      },
    });

    if (resume) {
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
    return catchORMError("Failed to delete online resumes", err);
  } finally {
    await prisma.$disconnect();
  }
}
